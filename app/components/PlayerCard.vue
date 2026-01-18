<template>
  <div
    :class="[
      'player-card',
      'flex flex-col items-center justify-center',
      'bg-white rounded-lg shadow-md',
      'transition-all duration-200',
      isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100',
      isStarter ? 'border-2 border-green-500' : 'border-2 border-gray-300',
      draggable ? 'cursor-move hover:shadow-lg' : 'cursor-default'
    ]"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    :style="cardStyle"
  >
    <!-- アバター -->
    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center flex-shrink-0">
      <img
        v-if="player.avatar_url"
        :src="player.avatar_url"
        :alt="player.user_name"
        class="w-full h-full object-cover"
      />
      <span v-else class="text-xs sm:text-sm font-medium text-white">
        {{ player.user_name?.charAt(0) || '?' }}
      </span>
    </div>

    <!-- 選手名 -->
    <p class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 text-center truncate max-w-full px-1">
      {{ player.user_name }}
    </p>

    <!-- ポジション表示とポジション変更ボタン -->
    <div v-if="positionName" class="flex items-center gap-1 mt-0.5">
      <p class="text-xs text-gray-600 font-medium">
        {{ positionName }}
      </p>
      <!-- ポジション変更ボタン（編集可能な場合のみ） -->
      <button
        v-if="allowPositionEdit"
        @click.stop="emit('positionEditRequest', player.player_id)"
        class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        title="ポジション変更"
      >
        ⚙️
      </button>
    </div>

    <!-- スタメン/サブ表示 -->
    <div v-if="showRosterStatus" class="mt-1">
      <span
        :class="[
          'text-xs px-2 py-0.5 rounded-full font-medium',
          isStarter ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        ]"
      >
        {{ isStarter ? 'スタメン' : 'サブ' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Player {
  player_id: string
  user_name: string
  avatar_url?: string
}

interface Props {
  player: Player
  positionName?: string | null
  rosterStatus?: 'starter' | 'sub' | null
  draggable?: boolean
  showRosterStatus?: boolean
  allowPositionEdit?: boolean
  availablePositions?: string[]
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  draggable: true,
  showRosterStatus: true,
  allowPositionEdit: false,
  availablePositions: () => ['GK', 'CB', 'LSB', 'RSB', 'DMF', 'CMF', 'OMF', 'LMF', 'RMF', 'LWG', 'CF', 'ST', 'RWG'],
  size: 'medium'
})

const emit = defineEmits<{
  dragStart: [playerId: string]
  dragEnd: []
  positionChange: [playerId: string, newPosition: string]
  positionEditRequest: [playerId: string]
}>()

const isDragging = ref(false)

const isStarter = computed(() => props.rosterStatus === 'starter')

const cardStyle = computed(() => {
  const sizes = {
    small: 'p-1 min-w-[60px]',
    medium: 'p-2 min-w-[80px]',
    large: 'p-3 min-w-[100px]'
  }
  return sizes[props.size]
})

const handleDragStart = (event: DragEvent) => {
  if (!props.draggable) return
  
  isDragging.value = true
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('playerId', props.player.player_id)
    event.dataTransfer.setData('playerName', props.player.user_name)
  }
  
  emit('dragStart', props.player.player_id)
}

const handleDragEnd = () => {
  isDragging.value = false
  emit('dragEnd')
}
</script>

<style scoped>
.player-card {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>

