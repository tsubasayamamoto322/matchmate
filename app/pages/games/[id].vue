<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-4 sm:p-8">
            <div class="max-w-4xl mx-auto">
                <!-- ヘッダー -->
                <div class="mb-4 sm:mb-6">
                    <NuxtLink to="/team_top"
                        class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        チームトップに戻る
                    </NuxtLink>
                </div>

                <!-- 試合情報セクション -->
                <div v-if="match" class="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">試合詳細</h1>
                        <!-- 監督用編集ボタン -->
                        <button v-if="isManager && !isEditingMatch" @click="startEditMatch"
                            class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            編集
                        </button>
                    </div>
                    
                    <!-- 編集モード -->
                    <div v-if="isEditingMatch && isManager" class="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border-2 border-green-200">
                        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">試合情報を編集</h2>
                        <form @submit.prevent="saveMatch" class="space-y-4">
                            <!-- 対戦相手 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">対戦相手</label>
                                <input v-model="editFormData.opponent_team" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                            </div>

                            <!-- 試合日付 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">試合日</label>
                                <input v-model="editFormData.game_date" type="date" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                            </div>

                            <!-- 試合時間 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">試合時間</label>
                                <input v-model="editFormData.game_time" type="time" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                            </div>

                            <!-- 場所 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">場所</label>
                                <input v-model="editFormData.location" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                            </div>

                            <!-- 備考 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">備考</label>
                                <textarea v-model="editFormData.notes"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows="3"></textarea>
                            </div>

                            <!-- エラーメッセージ -->
                            <div v-if="editError" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                                {{ editError }}
                            </div>

                            <!-- ボタン -->
                            <div class="flex flex-col sm:flex-row gap-3 pt-4">
                                <button type="button" @click="cancelEditMatch"
                                    class="w-full sm:flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                    キャンセル
                                </button>
                                <button type="submit" :disabled="isSavingMatch"
                                    class="w-full sm:flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ isSavingMatch ? '保存中...' : '保存' }}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- 試合情報グリッド（表示モード） -->
                    <div v-if="!isEditingMatch" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <!-- 対戦相手 -->
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">対戦相手</p>
                            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ match.opponent_team }}</p>
                        </div>

                        <!-- 試合日付 -->
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">試合日</p>
                            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ formatDate(match.game_date) }}（{{ formatDayOfWeek(match.game_date) }}）</p>
                        </div>

                        <!-- 試合時間 -->
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">試合時間</p>
                            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ formatTime(match.game_time) }}</p>
                        </div>

                        <!-- 場所 -->
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">場所</p>
                            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ match.location || '未定' }}</p>
                        </div>

                        <!-- 備考 -->
                        <div v-if="match.notes" class="sm:col-span-2">
                            <p class="text-sm font-medium text-gray-500 mb-1">備考</p>
                            <p class="text-sm sm:text-base text-gray-900">{{ match.notes }}</p>
                        </div>
                    </div>

                    <!-- 出欠回答セクション（選手用） -->
                    <div v-if="isPlayer" class="border-t border-gray-200 pt-6 sm:pt-8">
                        <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">出欠回答</h2>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button
                                @click="submitAttendance('participate')"
                                :disabled="isSubmittingAttendance"
                                :class="[
                                    'w-full sm:flex-1 px-6 py-3 rounded-lg font-medium transition-colors',
                                    myAttendance === 'participate'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                ]">
                                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                出席
                            </button>
                            <button
                                @click="submitAttendance('absent')"
                                :disabled="isSubmittingAttendance"
                                :class="[
                                    'w-full sm:flex-1 px-6 py-3 rounded-lg font-medium transition-colors',
                                    myAttendance === 'absent'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                ]">
                                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                欠席
                            </button>
                            <button
                                @click="submitAttendance('unanswered')"
                                :disabled="isSubmittingAttendance"
                                :class="[
                                    'w-full sm:flex-1 px-6 py-3 rounded-lg font-medium transition-colors',
                                    myAttendance === 'unanswered'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                ]">
                                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                未定
                            </button>
                        </div>
                        <p v-if="attendanceError" class="text-red-600 text-sm mt-2">{{ attendanceError }}</p>
                    </div>

                </div>

                <!-- 出欠状況セクション -->
                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-8">
                    <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">チーム内の出欠状況</h2>

                    <div v-if="loading" class="text-center py-8">
                        <p class="text-gray-500">読み込み中...</p>
                    </div>

                    <div v-else-if="attendanceList.length === 0" class="text-center py-8">
                        <p class="text-gray-500">出欠情報がありません</p>
                    </div>

                    <div v-else class="space-y-2">
                        <div v-for="attendance in attendanceList" :key="attendance.player_id"
                            class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-3">
                                <!-- プレイヤーアバター -->
                                <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img v-if="attendance.avatar_url" :src="attendance.avatar_url" :alt="attendance.user_name"
                                        class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-600">
                                        <span class="text-xs font-medium text-white">{{ attendance.user_name?.charAt(0) || '？' }}</span>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ attendance.user_name }}</p>
                                </div>
                            </div>
                            <span :class="[
                                'px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium',
                                getStatusClass(attendance.status)
                            ]">
                                {{ getStatusText(attendance.status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const route = useRoute()
const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

const { isManager, isPlayer, fetchUserRole } = useUserRole()
const { getTeamId } = useTeamSession()

// データ
const match = ref<any>(null)
const attendanceList = ref<any[]>([])
const loading = ref(true)
const myAttendance = ref<string>('unanswered')
const isSubmittingAttendance = ref(false)
const attendanceError = ref<string | null>(null)

// 試合情報編集用
const isEditingMatch = ref(false)
const isSavingMatch = ref(false)
const editError = ref<string | null>(null)
const editFormData = ref({
    opponent_team: '',
    game_date: '',
    game_time: '',
    location: '',
    notes: ''
})

// 試合情報を取得
const fetchMatch = async () => {
    try {
        const matchId = route.params.id as string
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', matchId)
            .single()

        if (error) {
            console.error('Error fetching match:', error)
            return
        }

        match.value = data
    } catch (err) {
        console.error('Error:', err)
    }
}

// 現在のユーザーの出欠情報と、チーム内全員の出欠情報を取得
const fetchAttendances = async () => {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser || !match.value) return

        const matchId = route.params.id as string

        // 監督の場合
        if (isManager.value) {
            // チームのメンバーを全て取得
            const { data: teamMembers, error: membersError } = await supabase
                .from('team_members')
                .select('player_id')
                .eq('team_id', match.value.team_id)
                .eq('status', 'approved')

            if (membersError || !teamMembers || teamMembers.length === 0) {
                console.error('Error fetching team members:', membersError)
                loading.value = false
                return
            }

            const memberIds = teamMembers.map((m: any) => m.player_id)
            
            // メンバーの出欠情報を取得
            const { data: attendances, error: attendanceError } = await supabase
                .from('attendances')
                .select(`
                    player_id,
                    status,
                    users!left(id, user_name, avatar_url)
                `)
                .eq('game_id', matchId)
                .in('player_id', memberIds)

            if (attendanceError) {
                console.error('Error fetching attendances:', attendanceError)
                loading.value = false
                return
            }

            if (attendances && attendances.length > 0) {
                const formatted = attendances
                    .filter((att: any) => att.users !== null)
                    .map((att: any) => ({
                        player_id: att.player_id,
                        status: att.status,
                        user_name: att.users.user_name,
                        avatar_url: att.users.avatar_url
                    }))

                attendanceList.value = formatted
            }
        } else {
            // 選手の場合：通常の出欠情報取得
            const { data: attendances, error: attendanceError } = await supabase
                .from('attendances')
                .select(`
                    player_id,
                    status,
                    users!left(id, user_name, avatar_url)
                `)
                .eq('game_id', matchId)

            if (attendanceError) {
                console.error('Error fetching attendances:', attendanceError)
                loading.value = false
                return
            }

            if (attendances) {
                const formatted = attendances
                    .filter((att: any) => att.users !== null)
                    .map((att: any) => ({
                        player_id: att.player_id,
                        status: att.status,
                        user_name: att.users.user_name,
                        avatar_url: att.users.avatar_url
                    }))

                // 現在のユーザーの出欠を抽出
                const myAtt = formatted.find((att: any) => att.player_id === authUser.id)
                if (myAtt) {
                    myAttendance.value = myAtt.status
                }

                attendanceList.value = formatted
            }
        }
    } catch (err) {
        console.error('Error fetching attendances:', err)
    } finally {
        loading.value = false
    }
}

// 出欠を更新
const submitAttendance = async (status: string) => {
    isSubmittingAttendance.value = true
    attendanceError.value = null

    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
            attendanceError.value = 'ユーザー認証エラー'
            return
        }

        const matchId = route.params.id as string

        // 出欠情報を更新
        const { error } = await supabase
            .from('attendances')
            .update({ status: status })
            .eq('game_id', matchId)
            .eq('player_id', authUser.id)

        if (error) {
            console.error('Error updating attendance:', error)
            attendanceError.value = '出欠の更新に失敗しました'
            return
        }

        // ローカル状態を更新
        myAttendance.value = status

        // 出欠リストも更新
        const myAttItem = attendanceList.value.find(att => att.player_id === authUser.id)
        if (myAttItem) {
            myAttItem.status = status
        }
    } catch (err) {
        console.error('Error:', err)
        attendanceError.value = '出欠の更新中にエラーが発生しました'
    } finally {
        isSubmittingAttendance.value = false
    }
}

// 試合情報編集機能
const startEditMatch = () => {
    if (!match.value) return
    editFormData.value = {
        opponent_team: match.value.opponent_team,
        game_date: match.value.game_date,
        game_time: match.value.game_time || '',
        location: match.value.location || '',
        notes: match.value.notes || ''
    }
    isEditingMatch.value = true
    editError.value = null
}

const cancelEditMatch = () => {
    isEditingMatch.value = false
    editError.value = null
}

const saveMatch = async () => {
    if (isSavingMatch.value) return
    isSavingMatch.value = true
    editError.value = null

    try {
        const matchId = route.params.id as string

        const { error } = await supabase
            .from('games')
            .update({
                opponent_team: editFormData.value.opponent_team,
                game_date: editFormData.value.game_date,
                game_time: editFormData.value.game_time,
                location: editFormData.value.location,
                notes: editFormData.value.notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', matchId)

        if (error) {
            console.error('Error updating match:', error)
            editError.value = '試合情報の更新に失敗しました'
            return
        }

        // マッチ情報を再取得して表示を更新
        await fetchMatch()
        isEditingMatch.value = false
    } catch (err) {
        console.error('Error:', err)
        editError.value = '試合情報の更新中にエラーが発生しました'
    } finally {
        isSavingMatch.value = false
    }
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

// ページ読み込み時にデータを取得
onMounted(async () => {
    await fetchUserRole()
    await fetchMatch()
    await fetchAttendances()
})

useHead({
    title: 'MatchMate - 試合詳細',
    meta: [
        { name: 'description', content: '試合詳細' }
    ]
})
</script>

