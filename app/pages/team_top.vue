<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-8">
            <div class="max-w-6xl mx-auto">
                <!-- ヘッダーセクション -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">お帰りなさい、アレックス！</h1>
                        </div>
                        <!-- 監督専用：試合作成ボタン -->
                        <NuxtLink v-if="isManager" to="/manager/games/create"
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
                    <h2 class="text-xl font-bold text-gray-900 mb-4">今後の試合</h2>

                    <!-- 次の試合カード -->
                    <div v-if="nextMatch" class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-6">
                                <div class="text-center">
                                    <p class="text-sm text-gray-500 mb-1">次の試合</p>
                                    <h3 class="text-2xl font-bold text-gray-900">{{ nextMatch.opponent_team }}</h3>
                                    <p class="text-sm text-gray-600 mt-2">{{ formatDate(nextMatch.game_date) }}（{{
                                        formatDayOfWeek(nextMatch.game_date) }}）・{{ formatTime(nextMatch.game_time) }}
                                    </p>
                                </div>
                                <div class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <img v-if="nextMatch.opponent_logo" :src="nextMatch.opponent_logo" alt="対戦チーム"
                                        class="w-full h-full object-cover rounded-lg" />
                                    <svg v-else class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="text-right">
                                <NuxtLink :to="`/games/${nextMatch.id}`"
                                    class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                    詳細を見る
                                </NuxtLink>
                                <p class="text-sm text-gray-500 mt-2">{{ nextMatch.location || '場所未定' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 出席セクション（試合表示の例） -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-900">出席</h3>
                        <div class="flex gap-2">
                            <button class="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                                詳細を表示
                            </button>
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
                                <span class="px-3 py-1 text-sm rounded-full"
                                    :class="getStatusClass(match.attendance_status)">
                                    {{ getStatusText(match.attendance_status) }}
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
                        <NuxtLink to="/team/members"
                            class="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center">
                            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p class="text-sm font-medium text-gray-900">チーム編集</p>
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

// 初期ロール情報を取得
onMounted(async () => {
    await fetchUserRole()
})

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

// ダミーデータ（後でデータベースから取得）
const nextMatch = ref({
    id: '1',
    opponent_team: 'サッカーゲーム vs. ダイタンズ',
    game_date: '2025-07-20',
    game_time: '13:00:00',
    location: '午後2時00分',
    attendance_status: 'pending',
    opponent_logo: null as string | null
})

const upcomingMatches = ref([
    {
        id: '1',
        opponent_team: 'サッカーゲーム vs. ダイタンズ',
        game_date: '2025-07-20',
        game_time: '14:00:00',
        location: null,
        attendance_status: 'confirmed'
    },
    {
        id: '2',
        opponent_team: 'バスケットボールゲーム vs. イーグルス',
        game_date: '2024-07-27',
        game_time: '16:00:00',
        location: null,
        attendance_status: 'pending'
    },
    {
        id: '3',
        opponent_team: 'バレーボールゲーム vs. シャークス',
        game_date: '2024-08-03',
        game_time: '16:00:00',
        location: null,
        attendance_status: 'confirmed'
    }
])

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
const formatTime = (timeString?: string) => {
    if (!timeString) return '時刻未定'
    const [hours, minutes = '00'] = timeString.split(':')
    const hour = parseInt(hours || '0')
    const ampm = hour < 12 ? '午前' : '午後'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${ampm}${displayHour}時${minutes}分`
}

// ステータスのクラス
const getStatusClass = (status: string) => {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-700'
        case 'pending':
            return 'bg-yellow-100 text-yellow-700'
        case 'declined':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

// ステータステキスト
const getStatusText = (status: string) => {
    switch (status) {
        case 'confirmed':
            return '確認済み'
        case 'pending':
            return '待機中'
        case 'declined':
            return '欠席'
        default:
            return '未定'
    }
}

useHead({
    title: 'MatchMate - チームトップ',
    meta: [
        { name: 'description', content: 'MatchMateチームトップ画面' }
    ]
})
</script>
