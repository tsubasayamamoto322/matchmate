<template>
  <div class="position-manager">
    <!-- ヘッダー（編集モード時のみ） -->
    <div v-if="isEditMode" class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">ポジション設定</h2>
      <div class="flex gap-2">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
        <button
          @click="cancelEdit"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>

    <!-- エラーメッセージ -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
      {{ error }}
    </div>

    <!-- 成功メッセージ -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 text-green-600 rounded-lg text-sm">
      {{ successMessage }}
    </div>

    <!-- フォーメーション選択（編集モード時のみ） -->
    <div v-if="isEditMode" class="mb-6">
      <FormationSelector
        v-model="selectedFormation"
        :editable="true"
        @apply="applyFormation"
      />
    </div>

    <!-- 編集モード選択（編集モード時のみ） -->
    <div v-if="isEditMode" class="mb-6 flex gap-3">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          v-model="editMode"
          value="swap"
          class="w-4 h-4"
        />
        <span class="text-sm font-medium text-gray-700">クリックしてポジションチェンジ</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          v-model="editMode"
          value="drag"
          class="w-4 h-4"
        />
        <span class="text-sm font-medium text-gray-700">ドラッグしてポジション調整</span>
      </label>
    </div>

    <!-- メインコンテンツ（横並び） -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- サッカーフィールド -->
      <div class="lg:col-span-2">
        <SoccerField
          :placed-players="placedPlayers"
          :empty-positions="isEditMode ? emptyPositions : []"
          :editable="isEditMode"
          :edit-mode="editMode"
          :selected-player-id="selectedPlayerForSwap"
          :selected-player-id-for-position-edit="selectedPlayerIdForPositionEdit"
          @player-placed="handlePlayerPlaced"
          @player-drag-start="handlePlayerDragStart"
          @player-selected="handlePlayerSelected"
          @position-swap="handlePositionSwap"
          @position-change="handlePositionChange"
          @position-edit-request="selectedPlayerIdForPositionEdit = $event"
          @close-position-modal="selectedPlayerIdForPositionEdit = null"
        />
      </div>

      <!-- 選手リスト -->
      <div class="lg:col-span-1">
        <!-- 未配置選手リスト（未配置選手がいる場合のみ表示） -->
        <PlayerList
          v-if="unplacedPlayers.length > 0"
          :players="unplacedPlayers"
          :editable="isEditMode"
          :edit-mode="editMode"
          :selected-player-id="selectedPlayerForSwap"
          title="未配置選手"
          empty-message="すべての選手が配置されています"
          @toggle-roster-status="toggleRosterStatus"
          @player-selected="handlePlayerSelected"
        />

        <!-- 控え選手リスト -->
        <PlayerList
          v-if="substitutePlayers.length > 0"
          :class="{ 'mt-4': unplacedPlayers.length > 0 }"
          :players="substitutePlayers"
          :editable="isEditMode"
          :edit-mode="editMode"
          :selected-player-id="selectedPlayerForSwap"
          title="控え選手"
          empty-message="控え選手はいません"
          @toggle-roster-status="toggleRosterStatus"
          @player-selected="handlePlayerSelected"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import FormationSelector from './FormationSelector.vue'
import SoccerField from './SoccerField.vue'
import PlayerList from './PlayerList.vue'
import { useFormations } from '@/composables/useFormations'

interface Player {
  player_id: string
  user_name: string
  avatar_url?: string
  position_id?: number | null
  position_name?: string | null
  field_x?: number | null
  field_y?: number | null
  roster_status: 'starter' | 'sub' | null
  status: string
}

interface Position {
  id: number
  name: string
}

interface Props {
  gameId: string
  players: Player[]
  availablePositions?: Position[]
}

const props = withDefaults(defineProps<Props>(), {
  availablePositions: () => []
})

const emit = defineEmits<{
  close: []
  saved: []
  'edit-mode-changed': [isEditing: boolean]
}>()

const supabase = useSupabaseClient()
const { getFormation } = useFormations()

// 状態管理
const isEditMode = ref(false)
const selectedFormation = ref('4-4-2')
const playerPositions = ref<Map<string, Player>>(new Map())
const isSaving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const editMode = ref<'drag' | 'swap'>('swap')
const selectedPlayerForSwap = ref<string | null>(null)
const selectedPlayerIdForPositionEdit = ref<string | null>(null)
const playerPositionsBackup = ref<Map<string, Player>>(new Map())

// 編集モード変更時に親に通知
watch(isEditMode, (newValue) => {
  emit('edit-mode-changed', newValue)
})

// position_idからポジション名を取得
const getPositionNameById = (positionId: number | null): string | null => {
  if (!positionId) return null
  const position = props.availablePositions.find(p => p.id === positionId)
  return position ? position.name : null
}

// 初期化（マウント時のみ）
onMounted(() => {
  // 既存のポジション情報をマップに格納
  // 初期状態ではroster_statusがnullの場合、デフォルトで'starter'に設定
  props.players.forEach(player => {
    const initializedPlayer = { ...player }
    if (initializedPlayer.roster_status === null) {
      initializedPlayer.roster_status = 'starter'
    }
    playerPositions.value.set(player.player_id, initializedPlayer)
  })

  // 12人出席の場合、最後の1人をサブに自動設定
  // ただし、全員のroster_statusがnullの場合のみ（初回設定時のみ）
  const participatingPlayers = Array.from(playerPositions.value.values())
    .filter(player => player.status === 'participate')
  
  const allRosterStatusNull = participatingPlayers.every(player => 
    props.players.find(p => p.player_id === player.player_id)?.roster_status === null
  )
  
  if (participatingPlayers.length === 12 && allRosterStatusNull) {
    // 最後の選手をサブに設定
    const lastPlayer = participatingPlayers[participatingPlayers.length - 1]
    if (lastPlayer) {
      lastPlayer.roster_status = 'sub'
      lastPlayer.field_x = null
      lastPlayer.field_y = null
    }
  }
})

// 配置済み選手（フィールド上に表示）
const placedPlayers = computed(() => {
  return Array.from(playerPositions.value.values()).filter(
    player => 
      player.roster_status === 'starter' &&
      player.field_x != null && 
      player.field_y != null
  )
})

// 未配置選手（スタメンだが未配置）
// 初期状態では roster_status === null の選手も含める
const unplacedPlayers = computed(() => {
  return Array.from(playerPositions.value.values()).filter(
    player => 
      (player.roster_status === 'starter' || player.roster_status === null) &&
      (player.field_x == null || player.field_y == null)
  )
})

// 控え選手
const substitutePlayers = computed(() => {
  return Array.from(playerPositions.value.values()).filter(
    player => player.roster_status === 'sub'
  )
})

// スタメン人数
// 初期状態では roster_status === null の選手もスタメン扱い
const starterCount = computed(() => {
  return Array.from(playerPositions.value.values()).filter(
    player => player.roster_status === 'starter' || player.roster_status === null
  ).length
})

// 空きフォーメーション位置（配置人数が足りない場所）
const emptyPositions = computed(() => {
  const formation = getFormation(selectedFormation.value)
  if (!formation) return []
  
  const occupied = new Set(placedPlayers.value.map(p => `${p.field_x},${p.field_y}`))
  const reversed = [...formation.positions].reverse()
  
  return reversed
    .slice(placedPlayers.value.length) // 配置済みの数以降
    .map((pos, idx) => ({
      id: `empty-${idx}`,
      x: pos.x,
      y: pos.y,
      positionName: getPositionNameById(pos.position_id) || ''
    }))
})

// フォーメーション適用
const applyFormation = (formationName: string) => {
  const formation = getFormation(formationName)
  if (!formation) return

  error.value = null
  
  // スタメン選手を取得（初期状態ではroster_statusがnullの選手も含める）
  const starters = Array.from(playerPositions.value.values()).filter(
    player => player.roster_status === 'starter' || player.roster_status === null
  )

  if (starters.length === 0) {
    error.value = '選手がいません。'
    return
  }

  // フォーメーションの各ポジションに選手を割り当て
  // フォーメーション位置を逆順（下から上へ）にして配置
  const reversedPositions = [...formation.positions].reverse()
  reversedPositions.forEach((pos, index) => {
    if (index < starters.length) {
      const starter = starters[index]
      if (starter) {
        const updatedPlayer = playerPositions.value.get(starter.player_id)
        if (updatedPlayer) {
          updatedPlayer.field_x = pos.x
          updatedPlayer.field_y = pos.y
          updatedPlayer.position_id = pos.position_id
          updatedPlayer.position_name = getPositionNameById(pos.position_id)
        }
      }
    }
  })

  successMessage.value = `${formationName}フォーメーションを適用しました`
  setTimeout(() => {
    successMessage.value = null
  }, 3000)
}

// 選手がフィールドに配置された
const handlePlayerPlaced = (playerId: string, x: number, y: number) => {
  const player = playerPositions.value.get(playerId)
  if (player) {
    player.field_x = x
    player.field_y = y
    
    // スタメンでない場合は自動的にスタメンにする
    if (player.roster_status !== 'starter') {
      player.roster_status = 'starter'
    }
  }
}

// 選手のドラッグ開始
const handlePlayerDragStart = (playerId: string) => {
  // ドラッグ開始時の処理（必要に応じて）
}

// 選手選択時（交換モード用）
const handlePlayerSelected = (playerId: string) => {
  if (editMode.value !== 'swap') return
  
  // 同じ選手を選択した場合は解除
  if (selectedPlayerForSwap.value === playerId) {
    selectedPlayerForSwap.value = null
    return
  }
  
  // 最初の選手を選択
  if (!selectedPlayerForSwap.value) {
    selectedPlayerForSwap.value = playerId
    return
  }
  
  // 2番目の選手を選択して交換
  const firstPlayer = playerPositions.value.get(selectedPlayerForSwap.value)
  const secondPlayer = playerPositions.value.get(playerId)
  
  if (!firstPlayer || !secondPlayer) {
    selectedPlayerForSwap.value = null
    return
  }
  
  // フィールド選手と控え選手の交換の場合
  const firstIsOnField = firstPlayer.roster_status === 'starter' && firstPlayer.field_x != null
  const secondIsOnField = secondPlayer.roster_status === 'starter' && secondPlayer.field_x != null
  const firstIsSub = firstPlayer.roster_status === 'sub'
  const secondIsSub = secondPlayer.roster_status === 'sub'
  
  if ((firstIsOnField && secondIsSub) || (firstIsSub && secondIsOnField)) {
    // フィールド選手と控え選手の入れ替え
    const fieldPlayer = firstIsOnField ? firstPlayer : secondPlayer
    const subPlayer = firstIsSub ? firstPlayer : secondPlayer
    
    // 控え選手をフィールドに配置
    subPlayer.field_x = fieldPlayer.field_x
    subPlayer.field_y = fieldPlayer.field_y
    subPlayer.position_id = fieldPlayer.position_id
    subPlayer.position_name = fieldPlayer.position_name
    subPlayer.roster_status = 'starter'
    
    // フィールド選手を控えに移動
    fieldPlayer.field_x = null
    fieldPlayer.field_y = null
    fieldPlayer.position_id = null
    fieldPlayer.position_name = null
    fieldPlayer.roster_status = 'sub'
  } else {
    // フィールド選手同士の交換
    const tempX = firstPlayer.field_x
    const tempY = firstPlayer.field_y
    const tempPositionId = firstPlayer.position_id
    const tempPositionName = firstPlayer.position_name
    
    firstPlayer.field_x = secondPlayer.field_x
    firstPlayer.field_y = secondPlayer.field_y
    firstPlayer.position_id = secondPlayer.position_id
    firstPlayer.position_name = secondPlayer.position_name
    
    secondPlayer.field_x = tempX
    secondPlayer.field_y = tempY
    secondPlayer.position_id = tempPositionId
    secondPlayer.position_name = tempPositionName
  }
  
  selectedPlayerForSwap.value = null
}

// 選手同士の位置交換（ドラッグ用、この実装は不要になったが念のため残す）
const handlePositionSwap = (draggedPlayerId: string, targetPlayerId: string) => {
  // 交換モードではない場合は何もしない
  if (editMode.value === 'drag') return
  
  const draggedPlayer = playerPositions.value.get(draggedPlayerId)
  const targetPlayer = playerPositions.value.get(targetPlayerId)
  
  if (!draggedPlayer || !targetPlayer) return
  
  // 座標とポジション情報を交換
  const tempX = draggedPlayer.field_x
  const tempY = draggedPlayer.field_y
  const tempPositionId = draggedPlayer.position_id
  const tempPositionName = draggedPlayer.position_name
  
  draggedPlayer.field_x = targetPlayer.field_x
  draggedPlayer.field_y = targetPlayer.field_y
  draggedPlayer.position_id = targetPlayer.position_id
  draggedPlayer.position_name = targetPlayer.position_name
  
  targetPlayer.field_x = tempX
  targetPlayer.field_y = tempY
  targetPlayer.position_id = tempPositionId
  targetPlayer.position_name = tempPositionName
}

// ポジション変更（ドラッグ調整モード用）
const handlePositionChange = (playerId: string, newPositionName: string) => {
  const player = playerPositions.value.get(playerId)
  if (!player) return
  
  // ポジション名からIDを取得
  const position = props.availablePositions.find(p => p.name === newPositionName)
  if (position) {
    player.position_id = position.id
    player.position_name = position.name
  }
}

// スタメン/サブの切り替え
const toggleRosterStatus = (playerId: string) => {
  const player = playerPositions.value.get(playerId)
  if (!player) return

  // roster_statusがnullまたは'starter'の場合 → 'sub'に変更
  if (player.roster_status === 'starter' || player.roster_status === null) {
    // スタメン → サブ（フィールドから削除）
    player.roster_status = 'sub'
    player.field_x = null
    player.field_y = null
  } else {
    // サブ → スタメン（フィールドには未配置）
    player.roster_status = 'starter'
  }
}

// 編集モード開始
const startEdit = () => {
  isEditMode.value = true
  // 現在の状態をバックアップ（キャンセル時用）
  playerPositionsBackup.value = new Map(
    Array.from(playerPositions.value.entries()).map(([key, player]) => [
      key,
      { ...player }
    ])
  )
}

// 編集モード終了（キャンセル）
const cancelEdit = () => {
  // バックアップから復元
  playerPositions.value = playerPositionsBackup.value
  playerPositionsBackup.value = new Map()
  isEditMode.value = false
  error.value = null
  selectedPlayerForSwap.value = null
  selectedPlayerIdForPositionEdit.value = null
}

// 保存処理
const handleSave = async () => {
  isSaving.value = true
  error.value = null
  successMessage.value = null

  try {
    // バリデーション：フィールドに配置されている選手が11人を超えていないかチェック
    if (placedPlayers.value.length > 11) {
      error.value = 'フィールドに配置できるのは最大11人までです'
      isSaving.value = false
      return
    }

    // 出席している選手のみを更新
    const participatingUpdates = Array.from(playerPositions.value.values())
      .filter(player => player.status === 'participate')

    // 一括更新（upsert）
    for (const player of participatingUpdates) {
      const { error: updateError } = await supabase
        .from('attendances')
        // @ts-ignore
        .update({
          position_id: player.position_id,
          field_x: player.field_x,
          field_y: player.field_y,
          roster_status: player.roster_status
        })
        .eq('game_id', props.gameId)
        .eq('player_id', player.player_id)

      if (updateError) {
        console.error('Error updating attendance:', updateError)
        throw updateError
      }
    }

    successMessage.value = 'ポジション情報を保存しました'
    isEditMode.value = false
    playerPositionsBackup.value = new Map()
    emit('saved')

    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    console.error('Error saving positions:', err)
    error.value = 'ポジション情報の保存に失敗しました'
  } finally {
    isSaving.value = false
  }
}

// 外部から呼び出し可能なメソッドをexpose
defineExpose({
  startEdit,
  cancelEdit
})
</script>

<style scoped>
/* styles */
</style>

