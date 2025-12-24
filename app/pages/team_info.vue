<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-8">
            <div class="max-w-6xl mx-auto">
                <!-- ヘッダー -->
                <div class="mb-6">
                    <NuxtLink to="/team_top"
                        class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        チームトップに戻る
                    </NuxtLink>
                </div>

                <!-- チーム情報カード -->
                <div v-if="teamData" class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div class="flex items-start justify-between mb-6">
                        <h1 class="text-3xl font-bold text-gray-900">チーム詳細</h1>
                        <!-- 監督専用：編集ボタン -->
                        <NuxtLink v-if="isManager && canEdit"
                            to="/manager/teams/create?edit=true"
                            class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            チーム情報を編集
                        </NuxtLink>
                    </div>

                    <div class="border-t border-gray-200 pt-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-6">チーム情報</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- 左側：テキスト情報 -->
                            <div class="space-y-6">
                                <!-- チーム名 -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-500 mb-2">チーム名</label>
                                    <p class="text-lg font-semibold text-gray-900">{{ teamData.team_name }}</p>
                                </div>

                                <!-- 監督名 -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-500 mb-2">監督</label>
                                    <p class="text-lg font-semibold text-gray-900">{{ managerName }}</p>
                                </div>

                                <!-- 所在地 -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-500 mb-2">所在地</label>
                                    <p class="text-lg text-gray-900">{{ teamData.address || '未設定' }}</p>
                                </div>
                            </div>

                            <!-- 右側：チームロゴ -->
                            <div class="flex justify-center items-center">
                                <div
                                    class="w-48 h-48 bg-gradient-to-br from-green-300 to-green-600 rounded-2xl overflow-hidden shadow-xl">
                                    <img v-if="teamData.team_logo_url" :src="teamData.team_logo_url"
                                        :alt="teamData.team_name" class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full flex items-center justify-center">
                                        <svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ロスター（所属選手一覧） -->
                <div class="bg-white rounded-xl shadow-lg mb-8">
                    <h2 class="text-xl font-bold text-gray-900 p-6">所属選手一覧</h2>
                    
                    <div v-if="loading" class="text-center py-8">
                        <p class="text-gray-500">読み込み中...</p>
                    </div>

                    <div v-else-if="playersApproved.length === 0" class="text-center py-8">
                        <p class="text-gray-500">所属選手はまだいません</p>
                    </div>

                    <div v-else class="space-y-2">
                        <div v-for="player in playersApproved" :key="player.id"
                            class="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.user_name" 
                                        class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-600">
                                        <span class="text-sm font-medium text-white">{{ player.user_name?.charAt(0) || '？' }}</span>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{ player.user_name }}</p>
                                </div>
                            </div>
                            <!-- 監督専用：チームから削除ボタン -->
                            <button v-if="isManager" @click="removePlayerFromTeam(player.id)"
                                :disabled="processingPlayerId === player.id"
                                class="px-3 py-1 text-sm font-semibold rounded-full transition-colors flex-shrink-0"
                                :class="{ 
                                    'bg-red-500 text-white hover:bg-red-600': processingPlayerId !== player.id,
                                    'bg-red-300 text-gray-700 cursor-not-allowed': processingPlayerId === player.id 
                                }">
                                {{ processingPlayerId === player.id ? '削除中' : '削除' }}
                            </button>
                        </div>
                    </div>
                </div>
                <!-- ロスター（承認待ち選手一覧） -->
                  <div class="bg-white rounded-xl shadow-lg mb-8">
                      <h2 class="text-xl font-bold text-gray-900 p-6">承認待ち選手一覧</h2>
                      
                      <div v-if="loading" class="text-center py-8">
                          <p class="text-gray-500">読み込み中...</p>
                      </div>

                      <div v-else-if="playersPending.length === 0" class="text-center py-8">
                          <p class="text-gray-500">現在、承認待ちの選手はいません</p>
                      </div>

                      <div v-else class="space-y-2 pb-4"> <div v-for="player in playersPending" :key="player.id"
                              class="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0">
                              <div class="flex items-center gap-3 flex-1 min-w-0">
                                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                      <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.user_name" 
                                          class="w-full h-full object-cover" />
                                      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-600">
                                          <span class="text-sm font-medium text-white">{{ player.user_name?.charAt(0) || '？' }}</span>
                                      </div>
                                  </div>
                                  <div class="flex-1 min-w-0">
                                      <p class="text-sm font-medium text-gray-900 truncate">{{ player.user_name }}</p>
                                  </div>
                              </div>

                              <div v-if="isManager" class="flex gap-2 flex-shrink-0">
                                  <button @click="updatePlayerStatus(player.id, 'approved')"
                                      :disabled="processingPlayerId === player.id"
                                      class="px-3 py-1 text-sm font-semibold rounded-full transition-colors 
                                          "
                                      :class="{ 
                                          'bg-green-500 text-white hover:bg-green-600': processingPlayerId !== player.id,
                                          'bg-green-300 text-gray-700 cursor-not-allowed': processingPlayerId === player.id 
                                      }">
                                      {{ processingPlayerId === player.id ? '処理中' : '承認' }}
                                  </button>

                                  <button @click="updatePlayerStatus(player.id, 'rejected')"
                                      :disabled="processingPlayerId === player.id"
                                      class="px-3 py-1 text-sm font-semibold rounded-full transition-colors 
                                          "
                                      :class="{ 
                                          'bg-red-500 text-white hover:bg-red-600': processingPlayerId !== player.id,
                                          'bg-red-300 text-gray-700 cursor-not-allowed': processingPlayerId === player.id 
                                      }">
                                      {{ processingPlayerId === player.id ? '処理中' : '拒否' }}
                                  </button>
                              </div>
                              <div v-else class="text-sm text-gray-500 flex-shrink-0">承認待ち</div>
                          </div>
                      </div>
                  </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
const { getTeamId } = useTeamSession()

// ロール情報を取得
const { isManager, fetchUserRole, userData: currentUser } = useUserRole()

// データ
const teamData = ref<any>(null)
const managerName = ref<string>('')
const playersApproved = ref<any[]>([])
const playersPending = ref<any[]>([])
const loading = ref(true)
const canEdit = ref(false)
const processingPlayerId = ref<string | null>(null)

// チーム情報を取得
const fetchTeamData = async () => {
    const teamId = await getTeamId()
    
    if (!teamId) {
        console.error('Team ID is missing')
        return
    }

    try {
        // チーム情報を取得
        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('*')
            .eq('id', teamId)
            .single()

        if (teamError) {
            console.error('Error fetching team:', teamError)
            return
        }

        teamData.value = team

        // 監督名を取得
        if (team.manager_id) {
            const { data: manager, error: managerError } = await supabase
                .from('users')
                .select('user_name')
                .eq('id', team.manager_id)
                .single()

            if (manager && !managerError) {
                managerName.value = manager.user_name
            }

            // 現在のユーザーが監督かどうかをチェック
            if (currentUser.value?.id === team.manager_id) {
                canEdit.value = true
            }
        }

        // 所属選手を取得（所属選手一覧 status="approved"）
        const { data: teamMembersapproved, error: membersapprovedError } = await supabase
            .from('team_members')
            .select('player_id')
            .eq('team_id', teamId)
            .eq('status', 'approved')

        if (membersapprovedError) {
            console.error('Error fetching team members:', membersapprovedError)
            return
        }

        // 選手の詳細情報を取得（所属選手一覧 status="approved"）
        if (teamMembersapproved && teamMembersapproved.length > 0) {
            const playerIds = teamMembersapproved.map(m => m.player_id)
            const { data: playersApprovedData, error: playersError } = await supabase
                .from('users')
                .select('id, user_name, avatar_url')
                .in('id', playerIds)

            if (playersError) {
                console.error('Error fetching playersApproved:', playersError)
                return
            }

            if (playersApprovedData && Array.isArray(playersApprovedData) && playersApprovedData.length > 0) {
                playersApproved.value = playersApprovedData
            }
        }

        // 所属選手を取得（所属選手一覧 status="pending"）
        const { data: teamMemberspending, error: memberspendingError } = await supabase
            .from('team_members')
            .select('player_id')
            .eq('team_id', teamId)
            .eq('status', 'pending')

        if (memberspendingError) {
            console.error('Error fetching team members:', memberspendingError)
            return
        }
        // 選手の詳細情報を取得（所属選手一覧 status="pending"）
        if (teamMemberspending && teamMemberspending.length > 0) {
            const playerIds = teamMemberspending.map(m => m.player_id)
            const { data: playersData, error: playersError } = await supabase
                .from('users')
                .select('id, user_name, avatar_url')
                .in('id', playerIds)

            if (playersError) {
                console.error('Error fetching playersPending:', playersError)
                return
            }

            if (playersData && Array.isArray(playersData) && playersData.length > 0) {
                playersPending.value = playersData
            }
        }

    } catch (err) {
        console.error('Error:', err)
    } finally {
        loading.value = false
    }
}

/**
 * 選手をチームから削除する（ステータスをrejectに変更）
 * @param playerId 選手のユーザーID
 */
const removePlayerFromTeam = async (playerId: string) => {
    const teamId = await getTeamId()
    if (!teamId) {
        alert('チーム情報が見つかりません。')
        return
    }

    if (!confirm('この選手をチームから削除してもよろしいですか？')) {
        return
    }

    processingPlayerId.value = playerId

    try {
        const { error } = await supabase
            .from('team_members')
            .update({ status: 'rejected', updated_at: new Date().toISOString() })
            .eq('team_id', teamId)
            .eq('player_id', playerId)

        if (error) {
            console.error('Error removing player from team:', error)
            alert('選手をチームから削除できませんでした。')
            return
        }

        alert('選手をチームから削除しました。')
        await fetchTeamData()
    } catch (err) {
        console.error('Remove operation failed:', err)
        alert('処理中にエラーが発生しました。')
    } finally {
        processingPlayerId.value = null
    }
}

/**
 * 選手の承認ステータスを更新する
 * @param playerId 選手のユーザーID
 * @param status 'approved' または 'rejected'
 */
const updatePlayerStatus = async (playerId: string, status: 'approved' | 'rejected') => {
    const teamId = await getTeamId()
    if (!teamId) {
        alert('チーム情報が見つかりません。')
        return
    }

    processingPlayerId.value = playerId; // 処理中のIDを設定

    try {
        const { error } = await supabase
            .from('team_members')
            .update({ status: status, updated_at: new Date().toISOString() }) // updated_atも更新
            .eq('team_id', teamId)
            .eq('player_id', playerId)
            .select()

        if (error) {
            console.error(`Error updating player status to ${status}:`, error)
            alert(`選手の${status === 'approved' ? '承認' : '拒否'}に失敗しました。`)
            return
        }

        // 成功した場合、リストを再取得して画面を更新
        alert(`選手を${status === 'approved' ? '承認' : '拒否'}しました。`)
        await fetchTeamData() // データを再取得
        window.location.reload()
    } catch (err) {
        console.error('Update operation failed:', err)
        alert('処理中にエラーが発生しました。')
    } finally {
        processingPlayerId.value = null; // 処理中のIDをリセット
    }
}
// ページ読み込み時に実行
onMounted(async () => {
    await fetchUserRole()
    await fetchTeamData()
})

useHead({
    title: 'MatchMate - チーム情報',
    meta: [
        { name: 'description', content: 'チーム情報詳細' }
    ]
})
</script>

