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

                <!-- ロスター（選手一覧） -->
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">所属選手一覧</h2>
                    
                    <div v-if="loading" class="text-center py-8">
                        <p class="text-gray-500">読み込み中...</p>
                    </div>

                    <div v-else-if="players.length === 0" class="text-center py-8">
                        <p class="text-gray-500">所属選手はまだいません</p>
                    </div>

                    <div v-else class="space-y-2">
                        <div v-for="player in players" :key="player.id"
                            class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.user_name" 
                                    class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-600">
                                    <span class="text-sm font-medium text-white">{{ player.user_name?.charAt(0) || '？' }}</span>
                                </div>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ player.user_name }}</p>
                            </div>
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
const players = ref<any[]>([])
const loading = ref(true)
const canEdit = ref(false)

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

        // 所属選手を取得
        const { data: teamMembers, error: membersError } = await supabase
            .from('team_members')
            .select('player_id')
            .eq('team_id', teamId)
            .eq('status', 'approved')

        if (membersError) {
            console.error('Error fetching team members:', membersError)
            return
        }

        // 選手の詳細情報を取得
        if (teamMembers && teamMembers.length > 0) {
            const playerIds = teamMembers.map(m => m.player_id)
            const { data: playersData, error: playersError } = await supabase
                .from('users')
                .select('id, user_name, avatar_url')
                .in('id', playerIds)

            if (playersData && !playersError) {
                players.value = playersData
            }
        }
    } catch (err) {
        console.error('Error:', err)
    } finally {
        loading.value = false
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

