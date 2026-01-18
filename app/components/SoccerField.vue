<template>
  <div class="soccer-field-container">
    <div
      ref="fieldRef"
      class="soccer-field relative bg-gradient-to-b from-green-400 via-green-500 to-green-600 rounded-lg overflow-hidden"
      :style="fieldStyle"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
    >
      <!-- フィールドパターン -->
      <div class="absolute inset-0 opacity-15">
        <div
          class="absolute inset-0"
          style="background-image: repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px); background-size: 70px 70px;"
        ></div>
      </div>

      <!-- センターライン（横線） -->
      <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-white opacity-40 transform -translate-y-1/2"></div>

      <!-- センターサークル -->
      <div class="absolute top-1/2 left-1/2 w-20 h-20 sm:w-24 sm:h-24 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>

      <!-- ペナルティエリア（上） -->
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 h-12 sm:h-16 border-2 border-white border-t-0 opacity-30"></div>

      <!-- ペナルティエリア（下） -->
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 h-12 sm:h-16 border-2 border-white border-b-0 opacity-30"></div>

      <!-- 配置された選手カード -->
      <div
        v-for="player in placedPlayers"
        :key="player.player_id"
        class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform"
        :class="[
          props.editMode === 'swap' && props.selectedPlayerId === player.player_id ? 'ring-2 ring-yellow-400 scale-110' : '',
          props.editMode === 'swap' ? 'hover:scale-105' : ''
        ]"
        :style="{
          left: `${(player.field_x != null ? player.field_x : 50)}%`,
          top: `${(player.field_y != null ? player.field_y : 50)}%`
        }"
        @dragover.prevent.stop="handleDragOverPlayer($event)"
        @drop.stop="props.editMode === 'drag' ? handleDropPlayer($event, player.player_id) : null"
        @click="props.editMode === 'swap' ? emit('playerSelected', player.player_id) : null"
      >
        <PlayerCard
          :player="player"
          :position-name="player.position_name"
          :roster-status="player.roster_status"
          :draggable="editable && props.editMode === 'drag'"
          :show-roster-status="false"
          :allow-position-edit="editable && props.editMode === 'drag'"
          :available-positions="['GK', 'CB', 'LSB', 'RSB', 'DMF', 'CMF', 'OMF', 'LMF', 'RMF', 'LWG', 'CF', 'ST', 'RWG']"
          size="small"
          @drag-start="handlePlayerDragStart"
          @position-change="handlePositionChange"
          @position-edit-request="$emit('positionEditRequest', $event)"
        />
      </div>

      <!-- 空きフォーメーション位置（プレースホルダー） -->
      <div
        v-for="emptyPos in emptyPositions"
        :key="emptyPos.id"
        class="absolute transform -translate-x-1/2 -translate-y-1/2"
        :style="{
          left: `${emptyPos.x}%`,
          top: `${emptyPos.y}%`
        }"
        @drop.prevent.stop="handleDropEmpty($event, emptyPos.x, emptyPos.y)"
        @dragover.prevent.stop
      >
        <div class="w-12 h-12 rounded-lg border-2 border-dashed border-white opacity-50 flex items-center justify-center text-xs text-white bg-white bg-opacity-10">
          {{ emptyPos.positionName }}
        </div>
      </div>

      <!-- ドラッグオーバー時のガイド -->
      <div
        v-if="isDraggingOver"
        class="absolute rounded-full border-2 border-dashed border-white opacity-50"
        :style="{
          left: `${dragPosition.x}%`,
          top: `${dragPosition.y}%`,
          width: '80px',
          height: '80px',
          transform: 'translate(-50%, -50%)'
        }"
      ></div>
    </div>

    <!-- フィールド説明 -->
    <div class="mt-2 text-xs text-gray-600 text-center">
      {{ editable ? '選手をドラッグしてフィールド上に配置してください' : 'フィールド配置' }}
    </div>

    <!-- ポジション変更モーダル -->
    <div
      v-if="props.selectedPlayerIdForPositionEdit"
      class="absolute inset-0 bg-opacity-10 backdrop-blur flex items-center justify-center z-50 rounded-lg"
      @click="emit('closePositionModal')"
    >
      <div
        class="bg-white rounded-lg shadow-2xl p-8 w-11/12 max-w-2xl"
        @click.stop
      >
        <h3 class="text-2xl font-bold text-gray-900 mb-6">
          {{ getPlayerName(props.selectedPlayerIdForPositionEdit) }}のポジション選択
        </h3>
        
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <button
            v-for="pos in availablePositionsList"
            :key="pos"
            @click="confirmPositionChange(pos)"
            :class="[
              'px-4 py-3 rounded-lg text-sm font-semibold transition-all',
              getSelectedPlayerPosition() === pos
                ? 'bg-green-600 text-white ring-2 ring-green-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ pos }}
          </button>
        </div>

        <div class="flex gap-3 mt-8">
          <button
            @click="emit('closePositionModal')"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerCard from './PlayerCard.vue'

interface PlayerOnField {
  player_id: string
  user_name: string
  avatar_url?: string
  position_id?: number | null
  position_name?: string | null
  field_x?: number | null
  field_y?: number | null
  roster_status: 'starter' | 'sub' | null
}

interface EmptyPosition {
  id: string
  x: number
  y: number
  positionName: string
}

interface Props {
  placedPlayers: PlayerOnField[]
  emptyPositions?: EmptyPosition[]
  editable?: boolean
  editMode?: 'drag' | 'swap'
  selectedPlayerId?: string | null
  selectedPlayerIdForPositionEdit?: string | null
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  emptyPositions: () => [],
  editable: true,
  editMode: 'drag',
  selectedPlayerId: null,
  selectedPlayerIdForPositionEdit: null,
  width: 400,
  height: 600
})

const emit = defineEmits<{
  playerPlaced: [playerId: string, x: number, y: number]
  playerDragStart: [playerId: string]
  playerSelected: [playerId: string]
  positionSwap: [draggedPlayerId: string, targetPlayerId: string]
  positionChange: [playerId: string, newPosition: string]
  positionEditRequest: [playerId: string]
  closePositionModal: []
}>()

const fieldRef = ref<HTMLElement | null>(null)
const isDraggingOver = ref(false)
const dragPosition = ref({ x: 50, y: 50 })

const fieldStyle = computed(() => {
  // レスポンシブ対応：画面サイズに応じて調整
  // 縦並びの場合、フィールド幅を広げる
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : props.width
  const isMobile = screenWidth < 640
  const fieldWidth = isMobile ? Math.min(screenWidth - 32, 450) : 600
  
  return {
    width: '100%',
    maxWidth: `${fieldWidth}px`,
    aspectRatio: '1 / 1.5',
    minHeight: '400px'
  }
})

const handleDragOver = (event: DragEvent) => {
  if (!props.editable) return
  
  event.preventDefault()
  isDraggingOver.value = true

  if (fieldRef.value && event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
    
    // フィールド内の相対座標を計算
    const rect = fieldRef.value.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    
    // 範囲を制限（0-100%）
    dragPosition.value = {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    }
  }
}

const handleDrop = (event: DragEvent) => {
  if (!props.editable) return
  
  event.preventDefault()
  isDraggingOver.value = false

  if (!fieldRef.value || !event.dataTransfer) return

  const playerId = event.dataTransfer.getData('playerId')
  if (!playerId) return

  // フィールド内の相対座標を計算
  const rect = fieldRef.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // 範囲を制限（5-95%）
  const finalX = Math.max(5, Math.min(95, x))
  const finalY = Math.max(5, Math.min(95, y))

  emit('playerPlaced', playerId, finalX, finalY)
}

const handlePlayerDragStart = (playerId: string) => {
  emit('playerDragStart', playerId)
}

// 選手の上へドラッグオーバー
const handleDragOverPlayer = (event: DragEvent) => {
  if (!props.editable) return
  event.preventDefault()
}

// 選手の上にドロップ（位置交換）
const handleDropPlayer = (event: DragEvent, targetPlayerId: string) => {
  if (!props.editable) return
  
  event.preventDefault()
  isDraggingOver.value = false

  const draggedPlayerId = event.dataTransfer?.getData('playerId')
  if (!draggedPlayerId || draggedPlayerId === targetPlayerId) return

  emit('positionSwap', draggedPlayerId, targetPlayerId)
}

// 空き位置にドロップ
const handleDropEmpty = (event: DragEvent, x: number, y: number) => {
  if (!props.editable) return
  
  event.preventDefault()
  isDraggingOver.value = false

  const playerId = event.dataTransfer?.getData('playerId')
  if (!playerId) return

  emit('playerPlaced', playerId, x, y)
}

// ポジション変更
const handlePositionChange = (playerId: string, newPosition: string) => {
  emit('positionChange', playerId, newPosition)
}

// ポジション変更モーダル用のヘルパー関数
const availablePositionsList = [
  'GK', 'CB', 'LSB', 'RSB', 'DMF', 'CMF', 'OMF', 'LMF', 'RMF', 'LWG', 'CF', 'ST', 'RWG'
]

const getPlayerName = (playerId: string) => {
  const player = props.placedPlayers.find(p => p.player_id === playerId)
  return player?.user_name || '選手'
}

const getSelectedPlayerPosition = () => {
  if (!props.selectedPlayerIdForPositionEdit) return null
  const player = props.placedPlayers.find(p => p.player_id === props.selectedPlayerIdForPositionEdit)
  return player?.position_name || null
}

const confirmPositionChange = (newPosition: string) => {
  if (!props.selectedPlayerIdForPositionEdit) return
  emit('positionChange', props.selectedPlayerIdForPositionEdit, newPosition)
  emit('closePositionModal')
}

// ドラッグが終了したらガイドを非表示
onMounted(() => {
  document.addEventListener('dragend', () => {
    isDraggingOver.value = false
  })
})
</script>

<style scoped>
.soccer-field {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

