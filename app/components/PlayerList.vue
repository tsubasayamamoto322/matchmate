<template>
  <div class="player-list bg-white rounded-lg shadow-lg p-4">
    <h3 class="text-lg font-bold text-gray-900 mb-4">{{ title }}</h3>

    <!-- 未配置選手リスト -->
    <div v-if="players.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="player in players"
        :key="player.player_id"
        class="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <PlayerCard
          :player="player"
          :position-name="player.position_name"
          :roster-status="player.roster_status"
          :draggable="editable"
          :show-roster-status="true"
          size="small"
          class="flex-shrink-0"
        />

        <!-- スタメン/サブ切り替えボタン（編集可能な場合のみ） -->
        <div v-if="editable" class="flex gap-2 ml-2">
          <button
            @click="emit('toggleRosterStatus', player.player_id)"
            :class="[
              'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
              player.roster_status === 'starter'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ player.roster_status === 'starter' ? 'スタメン' : 'サブ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 選手がいない場合 -->
    <div v-else class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="text-sm">{{ emptyMessage }}</p>
    </div>

    <!-- ヘルプテキスト -->
    <div v-if="editable && players.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-xs text-blue-700">
        💡 選手をドラッグしてフィールド上に配置できます。スタメン/サブボタンで切り替えも可能です。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerCard from './PlayerCard.vue'

interface Player {
  player_id: string
  user_name: string
  avatar_url?: string
  position_id?: number | null
  position_name?: string | null
  field_x?: number | null
  field_y?: number | null
  roster_status: 'starter' | 'sub' | null
}

interface Props {
  players: Player[]
  title?: string
  editable?: boolean
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '未配置選手',
  editable: true,
  emptyMessage: '配置可能な選手がいません'
})

const emit = defineEmits<{
  toggleRosterStatus: [playerId: string]
}>()
</script>

<style scoped>
/* カスタムスクロールバー */
.player-list .space-y-2::-webkit-scrollbar {
  width: 6px;
}

.player-list .space-y-2::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.player-list .space-y-2::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.player-list .space-y-2::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

