<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-8">
            <div class="max-w-6xl mx-auto">
                <!-- ヘッダーセクション -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">ようこそ、{{ userData?.user_name || 'ゲスト' }}さん</h1>
                        </div>
                        <!-- 監督専用：試合作成ボタン -->
                        <NuxtLink v-if="isManager" to="/manager/games/game_create"
                            class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            試合を作成
                        </NuxtLink>
                    </div>
                </div>

                <!-- 今後の試合セクション -->
                <div class="mb-8">
                    <!-- <h2 class="text-xl font-bold text-gray-900 mb-4">次の試合</h2> -->

                    <!-- 次の試合カード -->
                    <div v-if="nextMatch" class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-6">
                                <div class="text-center">
                                    <p class="text-sm text-gray-500 mb-1">次の試合</p>
                                    <h3 class="text-2xl font-bold text-gray-900">vs {{ nextMatch.opponent_team }}</h3>
                                    <p class="text-sm text-gray-600 mt-2">{{ formatDate(nextMatch.game_date) }}（{{
                                        formatDayOfWeek(nextMatch.game_date) }}）・{{ formatTime(nextMatch.game_time) }}
                                    </p>
                                    <p class="text-sm text-gray-500 mt-2">{{ nextMatch.location || '場所未定' }}</p>
                                </div>
                                <div class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <img v-if="nextMatch.opponent_logo" :src="nextMatch.opponent_logo" alt="対戦チーム"
                                        class="w-full h-full object-cover rounded-lg" />
                                    <svg v-else class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="text-right flex flex-col gap-3">
                                <!-- 選手用：出欠ステータス表示 -->
                                <div v-if="isPlayer">
                                    <span class="px-3 py-1 text-sm rounded-full"
                                        :class="getStatusClass(nextMatch.attendance_status)">
                                        {{ getStatusText(nextMatch.attendance_status) }}
                                    </span>
                                </div>
                                <!-- 監督用：未回答者ステータス表示 -->
                                <div v-else-if="isManager">
                                    <span class="px-3 py-1 text-sm rounded-full"
                                        :class="nextMatch.attendance_status === 'unanswered' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'">
                                        {{ nextMatch.attendance_status === 'unanswered' ? '未回答者あり' : '全員回答済み' }}
                                    </span>
                                </div>
                                <NuxtLink :to="`/games/${nextMatch.id}`"
                                    class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                    詳細を見る
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 出席セクション（試合表示の例） -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-900">直近の試合</h3>
                        <div class="flex gap-2">
                            <NuxtLink to="/schedule"
                                class="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors">
                                すべての試合を表示する
                            </NuxtLink>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div v-for="match in upcomingMatches" :key="match.id"
                            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">{{ match.opponent_team }}</p>
                                    <p class="text-sm text-gray-600">{{ formatDate(match.game_date) }}（{{
                                        formatDayOfWeek(match.game_date) }}）・{{ formatTime(match.game_time) }}</p>
                                    <p class="text-sm text-gray-500">{{ match.location || '場所未定' }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <!-- 選手用：出欠ステータス表示 -->
                                <span v-if="isPlayer" class="px-3 py-1 text-sm rounded-full"
                                    :class="getStatusClass(match.attendance_status)">
                                    {{ getStatusText(match.attendance_status) }}
                                </span>
                                <!-- 監督用：未回答者ステータス表示 -->
                                <span v-else-if="isManager" class="px-3 py-1 text-sm rounded-full"
                                    :class="match.attendance_status === 'unanswered' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'">
                                    {{ match.attendance_status === 'unanswered' ? '未回答者あり' : '全員回答済み' }}
                                </span>
                                <NuxtLink :to="`/games/${match.id}`"
                                    class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                    詳細
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- クイックアクションセクション -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">クイックアクション</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <NuxtLink to="/team_info"
                            class="relative p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center block">
                            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p class="text-sm font-medium text-gray-900">チーム情報</p>
                            <!-- 承認待ち選手がいる場合のインジケーター（監督のみ） -->
                            <div v-if="isManager && pendingMembersCount > 0" class="absolute -top-2 -right-2">
                                <div class="relative w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                    {{ pendingMembersCount }}
                                </div>
                            </div>
                        </NuxtLink>

                        <NuxtLink to="/profile"
                            class="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center">
                            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p class="text-sm font-medium text-gray-900">プロフィール設定</p>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

// ロール情報を取得
const { isManager, isPlayer, fetchUserRole } = useUserRole()
const { getTeamId } = useTeamSession()
const route = useRoute()


const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

// ユーザーデータ
const userData = ref<any>(null)

// ユーザー情報を取得
const fetchUserData = async () => {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
            return
        }

        const { data, error } = await supabase
            .from('users')
            .select('id, user_name')
            .eq('id', authUser.id)
            .single()

        if (error) {
            console.error('Error fetching user data:', error)
            return
        }

        userData.value = data
        console.log('User data:', data)
    } catch (err) {
        console.error('Error fetching user data:', err)
    }
}

// データ型定義
interface Match {
    id: string
    team_id: string
    game_date: string
    game_time?: string | null
    opponent_team: string
    location?: string | null
    created_at?: string
    updated_at?: string
    opponent_logo?: string | null
    attendance_status?: string
}

const nextMatch = ref<Match | undefined>(undefined)
const upcomingMatches = ref<Match[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pendingMembersCount = ref(0)

// Supabaseからデータを取得
const fetchMatches = async () => {
    loading.value = true
    error.value = null
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        // セッションからチームIDを取得
        const teamId = await getTeamId()

        // 現在の日付を取得
        const now = new Date()
        const todayDate = now.toISOString().substring(0, 10)

        // 本日以降の試合をすべて取得
        if (!authUser) {
            error.value = 'ユーザー認証情報が取得できません'
            return
        }

        // 選手の場合
        if (isPlayer.value) {
            const { data: allMatches, error: fetchError } = await supabase
                .from('games')
                .select('*,attendances!left(status)')
                .eq('team_id', teamId)
                .eq('attendances.player_id', authUser.id)
                .gte('game_date', todayDate)
                .order('game_date', { ascending: true })
                .order('game_time', { ascending: true })

            if (fetchError) {
                throw new Error(fetchError.message)
            }

            const matchesWithStatus = (allMatches || []).map(match => {
                const status = (match.attendances && 
                                match.attendances.length > 0 && 
                                match.attendances[0]?.status)
                               ? match.attendances[0].status 
                               : 'unanswered'; 
                
                const { attendances, ...rest } = match;

                return {
                    ...rest, 
                    attendance_status: status as string
                } as Match
            })

            if (matchesWithStatus.length > 0) {
                nextMatch.value = matchesWithStatus[0]
                upcomingMatches.value = matchesWithStatus.slice(1, 4)
            }
        } else if (isManager.value) {
            // 監督の場合：試合と全attendancesを取得
            const { data: allMatches, error: fetchError } = await supabase
                .from('games')
                .select('*,attendances(status)')
                .eq('team_id', teamId)
                .gte('game_date', todayDate)
                .order('game_date', { ascending: true })
                .order('game_time', { ascending: true })

            if (fetchError) {
                throw new Error(fetchError.message)
            }

            const matchesWithStatus = (allMatches || []).map(match => {
                // 未回答者がいるかを判定
                const hasUnanswered = (match.attendances || []).some(
                    (att: any) => att.status === 'unanswered'
                )
                
                const { attendances, ...rest } = match;

                return {
                    ...rest, 
                    attendance_status: hasUnanswered ? 'unanswered' : 'answered'
                } as Match
            })

            if (matchesWithStatus.length > 0) {
                nextMatch.value = matchesWithStatus[0]
                upcomingMatches.value = matchesWithStatus.slice(1, 4)
            }
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'データ取得に失敗しました'
        console.error('Error fetching matches:', err)
    } finally {
        loading.value = false
    }
}

// 承認待ち選手を取得
const fetchPendingMembers = async () => {
    try {
        const teamId = await getTeamId()
        if (!teamId) return

        const { data, error: fetchError } = await supabase
            .from('team_members')
            .select('id')
            .eq('team_id', teamId)
            .eq('status', 'pending')

        if (fetchError) {
            console.error('Error fetching pending members:', fetchError)
            return
        }

        pendingMembersCount.value = data?.length || 0
    } catch (err) {
        console.error('Error in fetchPendingMembers:', err)
    }
}

// ページ読み込み時にデータを取得
onMounted(async () => {
    await fetchUserRole()
    await fetchUserData()
    await fetchMatches()
    
    // 監督の場合のみ承認待ち選手を取得
    if (isManager.value) {
        await fetchPendingMembers()
    }
})

// 日付フォーマット
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 曜日フォーマット
const formatDayOfWeek = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['日', '月', '火', '水', '木', '金', '土']
    return days[date.getDay()]
}

// 時刻フォーマット
const formatTime = (timeString?: string | null) => {
    if (!timeString) return '時刻未定'
    const [hours, minutes = '00'] = timeString.split(':')
    const hour = parseInt(hours || '0')
    const ampm = hour < 12 ? '午前' : '午後'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${ampm}${displayHour}時${minutes}分`
}

// ステータスのクラス
const getStatusClass = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-700'
    switch (status) {
        case 'participate':
            return 'bg-green-100 text-green-700'
        case 'unanswered':
            return 'bg-yellow-100 text-yellow-700'
        case 'absent':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

// ステータステキスト
const getStatusText = (status?: string) => {
    if (!status) return '未回答'
    switch (status) {
        case 'participate':
            return '出席'
        case 'unanswered':
            return '未回答'
        case 'absent':
            return '欠席'
        default:
            return '未回答'
    }
}

useHead({
    title: 'MatchMate - チームトップ',
    meta: [
        { name: 'description', content: 'MatchMateチームトップ画面' }
    ]
})
</script>
