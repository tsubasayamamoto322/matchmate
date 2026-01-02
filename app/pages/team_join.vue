<template>
  <div class="flex flex-col flex-1">
    <main class="flex-1 p-4 sm:p-8">
      <div class="max-w-4xl mx-auto">
        <!-- ヘッダー -->
        <div class="mb-6 sm:mb-8 text-center">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">チームに参加</h1>
          <p class="text-sm sm:text-base text-gray-600">参加したいチームを選択してください</p>
        </div>

        <!-- 未参加チーム一覧 -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">参加申請可能なチーム</h2>

          <div v-if="loadingAvailableTeams" class="text-center py-8">
            <p class="text-gray-500">読み込み中...</p>
          </div>

          <div v-else-if="availableTeams.length === 0" class="text-center py-8">
            <div class="mb-4 text-6xl">✅</div>
            <p class="text-gray-500">参加可能なチームがありません</p>
            <p class="text-sm text-gray-400 mt-2">全てのチームに参加済みです</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="team in availableTeams" 
              :key="team.id"
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-4"
            >
              <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <!-- チームロゴ -->
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <img v-if="team.team_logo_url" :src="team.team_logo_url" :alt="team.team_name" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl text-white font-bold">{{ team.team_name?.charAt(0) || 'T' }}</span>
                </div>
                
                <!-- チーム情報 -->
                <div class="text-center sm:text-left">
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg">{{ team.team_name || '不明なチーム' }}</h3>
                  <p class="text-sm text-gray-600">{{ team.address }}</p>
                </div>
              </div>

              <button
                @click="handleJoinTeam(team)"
                :disabled="joiningTeamId === team.id"
                class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ joiningTeamId === team.id ? '参加中...' : '参加する' }}
              </button>
            </div>
          </div>

          <!-- エラーメッセージ -->
          <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- 成功メッセージ -->
          <div v-if="success" class="mt-4 p-4 bg-green-50 text-green-600 rounded-lg">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1">
                <p class="font-semibold text-green-800 mb-2">{{ success }}</p>
                <NuxtLink 
                  to="/team_select"
                  class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  チーム選択ページに戻る
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
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

const availableTeams = ref<any[]>([])
const loadingAvailableTeams = ref(true)
const joiningTeamId = ref<string | null>(null)
const error = ref('')
const success = ref('')

// 未参加のチーム一覧を取得
const fetchAvailableTeams = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      loadingAvailableTeams.value = false
      return
    }

    // 全チームを取得
    const { data: allTeams, error: teamsError } = await supabase
      .from('teams')
      .select('id, team_name, team_logo_url, address, created_at')
      .order('created_at', { ascending: false })

    if (teamsError) {
      console.error('Fetch teams error:', teamsError)
      loadingAvailableTeams.value = false
      return
    }

    // 参加済みのチームIDを取得
    const { data: memberData, error: memberError } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('player_id', user.id)

    if (memberError) {
      console.error('Fetch member teams error:', memberError)
    }

    const joinedTeamIds = new Set(memberData?.map(m => m.team_id) || [])

    // 未参加のチームのみをフィルタリング
    availableTeams.value = (allTeams || []).filter(team => !joinedTeamIds.has(team.id))

  } catch (err) {
    console.error('Error:', err)
  } finally {
    loadingAvailableTeams.value = false
  }
}

// チーム参加処理
const handleJoinTeam = async (team: any) => {
  joiningTeamId.value = team.id
  error.value = ''
  success.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      error.value = 'ログインが必要です'
      joiningTeamId.value = null
      return
    }

    // チームメンバーに追加（ステータスはpendingで登録）
    const { error: insertError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        player_id: user.id,
        status: 'pending',
        created_at: new Date().toISOString()
      })

    if (insertError) {
      // 既に参加している場合のエラーハンドリング
      if (insertError.code === '23505') {
        error.value = '既にこのチームに参加申請しています'
      } else {
        error.value = 'チームへの参加申請に失敗しました'
      }
      console.error('Insert error:', insertError)
      joiningTeamId.value = null
      return
    }

    // 成功
    success.value = `${team.team_name}への参加申請を送信しました！承認をお待ちください。`
    
    // 一覧を再取得
    await fetchAvailableTeams()

  } catch (err) {
    error.value = 'エラーが発生しました'
    console.error('Join team error:', err)
  } finally {
    joiningTeamId.value = null
  }
}

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// ページ読み込み時に実行
onMounted(async () => {
  await fetchAvailableTeams()
})

useHead({
  title: 'MatchMate - チーム参加',
  meta: [
    { name: 'description', content: 'チームに参加' }
  ]
})
</script>