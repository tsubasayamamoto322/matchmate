<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-8">
            <div class="max-w-4xl mx-auto">
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

                <!-- プロフィールカード -->
                <div v-if="userData" class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div class="flex items-start gap-8">
                        <!-- アバター -->
                        <div class="flex-shrink-0">
                            <div class="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center shadow-lg">
                                <img v-if="userData.avatar_url" :src="userData.avatar_url" :alt="userData.user_name"
                                    class="w-full h-full object-cover" />
                                <div v-else class="text-5xl text-white font-bold">
                                    {{ userData.user_name?.charAt(0) || '？' }}
                                </div>
                            </div>
                        </div>

                        <!-- ユーザー情報 -->
                        <div class="flex-grow">
                            <div class="mb-6">
                                <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ userData.user_name }}</h1>
                                <p class="text-gray-600">{{ roleText }}</p>
                            </div>

                            <div class="space-y-4">
                                <!-- メールアドレス -->
                                <div>
                                    <p class="text-sm font-medium text-gray-500 mb-1">メールアドレス</p>
                                    <p class="text-gray-900">{{ userData.email || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 過去の出席セクション -->
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">過去の試合</h2>

                    <div v-if="loading" class="text-center py-8">
                        <p class="text-gray-500">読み込み中...</p>
                    </div>

                    <div v-else-if="pastMatches.length === 0" class="text-center py-8">
                        <p class="text-gray-500">過去の試合情報はありません</p>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="match in pastMatches" :key="match.id"
                            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div class="flex-grow">
                                <p class="font-semibold text-gray-900 mb-1">{{ match.opponent_team }}</p>
                                <p class="text-sm text-gray-600">{{ formatDate(match.game_date) }}（{{ formatDayOfWeek(match.game_date) }}）・{{ formatTime(match.game_time) }}</p>
                                <p class="text-sm text-gray-500">{{ match.location || '場所未定' }}</p>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                                <NuxtLink :to="`/games/${match.id}`"
                                    class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                    詳細
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- もっと見るボタン -->
                        <div class="flex justify-center mt-8">
                            <NuxtLink to="/schedule?show=past"
                                class="px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                                もっと見る
                            </NuxtLink>
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
const { isManager, isPlayer } = useUserRole()
const { getTeamId } = useTeamSession()

// データ
const userData = ref<any>(null)
const pastMatches = ref<any[]>([])
const loading = ref(true)

// ロール表示テキスト
const roleText = computed(() => {
    if (isManager.value) return '監督'
    if (isPlayer.value) return '選手'
    return 'ユーザー'
})

// ユーザー情報を取得
const fetchUserData = async () => {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return

        const { data, error } = await supabase
            .from('users')
            .select('id, user_name, email, avatar_url')
            .eq('id', authUser.id)
            .single()

        if (error) {
            console.error('Error fetching user data:', error)
            return
        }

        userData.value = data
    } catch (err) {
        console.error('Error:', err)
    }
}

// 過去の試合を取得
const fetchPastMatches = async () => {
    try {
        const teamId = await getTeamId()
        if (!teamId) return

        const now = new Date()
        const todayDate = now.toISOString().substring(0, 10)

        // 過去の試合を直近5つ取得
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('team_id', teamId)
            .lt('game_date', todayDate)
            .order('game_date', { ascending: false })
            .order('game_time', { ascending: false })
            .limit(5)

        if (error) {
            console.error('Error fetching past matches:', error)
            return
        }

        pastMatches.value = data || []
    } catch (err) {
        console.error('Error:', err)
    } finally {
        loading.value = false
    }
}

// ページ読み込み時に実行
onMounted(async () => {
    await fetchUserData()
    await fetchPastMatches()
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
const formatTime = (timeString: string | null) => {
    if (!timeString) return '時刻未定'
    const [hours, minutes = '00'] = timeString.split(':')
    const hour = parseInt(hours || '0')
    const ampm = hour < 12 ? '午前' : '午後'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${ampm}${displayHour}時${minutes}分`
}

useHead({
    title: 'MatchMate - プロフィール',
    meta: [
        { name: 'description', content: 'プロフィール' }
    ]
})
</script>

