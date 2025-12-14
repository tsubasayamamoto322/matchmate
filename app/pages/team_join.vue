<template>
  <div class="flex flex-col flex-1">
    <main class="flex-1 p-8">
      <div class="max-w-4xl mx-auto">
        <!-- ヘッダー -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">チームに参加</h1>
          <p class="text-gray-600">参加したいチームを選択してください</p>
        </div>

        <!-- 未参加チーム一覧 -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">参加申請可能なチーム</h2>

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
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <!-- チームロゴ -->
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <img v-if="team.team_logo_url" :src="team.team_logo_url" :alt="team.team_name" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl text-white font-bold">{{ team.team_name?.charAt(0) || 'T' }}</span>
                </div>
                
                <!-- チーム情報 -->
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">{{ team.team_name || '不明なチーム' }}</h3>
                  <p class="text-sm text-gray-600">{{ team.address }}</p>
                </div>
              </div>

              <button
                @click="handleJoinTeam(team)"
                :disabled="joiningTeamId === team.id"
                class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div v-if="success" class="mt-4 p-4 bg-green-50 text-green-600 rounded-lg text-sm">
            {{ success }}
          </div>
        </div>

        <!-- 参加済みチーム一覧 -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">参加中のチーム</h2>

          <div v-if="loadingJoinedTeams" class="text-center py-8">
            <p class="text-gray-500">読み込み中...</p>
          </div>

          <div v-else-if="joinedTeams.length === 0" class="text-center py-8">
            <div class="mb-4 text-6xl">⚽</div>
            <p class="text-gray-500">まだチームに参加していません</p>
            <p class="text-sm text-gray-400 mt-2">上記の参加可能なチームから選択してください</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="team in joinedTeams" 
              :key="team.team_id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-4 flex-1">
                <!-- チームロゴ -->
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <img v-if="team.teams?.team_logo_url" :src="team.teams.team_logo_url" :alt="team.teams.team_name" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl text-white font-bold">{{ team.teams?.team_name?.charAt(0) || 'T' }}</span>
                </div>
                
                <!-- チーム情報 -->
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 text-lg">{{ team.teams?.team_name || '不明なチーム' }}</h3>
                  <p class="text-sm text-gray-600">参加日: {{ formatDate(team.created_at) }}</p>
                  
                  <!-- ステータスバッジ -->
                  <div class="mt-2">
                    <span 
                      v-if="team.status === 'approved'"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
                    >
                      ✓ 承認済み
                    </span>
                    <span 
                      v-else-if="team.status === 'pending'"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"
                    >
                      ⏱ 承認待ち
                    </span>
                    <span 
                      v-else-if="team.status === 'rejected'"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
                    >
                      ✕ 却下
                    </span>
                    <span 
                      v-else
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"
                    >
                      ー 不明
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-2">
                <button
                  v-if="team.status === 'rejected'"
                  @click="handleRejoinTeam(team.team_id, team.teams?.team_name)"
                  :disabled="rejoiningTeamId === team.team_id"
                  class="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ rejoiningTeamId === team.team_id ? '再申請中...' : '再申請' }}
                </button>
              <button
                @click="selectTeam(team.team_id)"
                :disabled="team.status !== 'approved'"
                class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                チームトップへ
              </button>
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
const joinedTeams = ref<any[]>([])
const loadingAvailableTeams = ref(true)
const loadingJoinedTeams = ref(true)
const joiningTeamId = ref<string | null>(null)
const rejoiningTeamId = ref<string | null>(null)
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

// 参加中のチーム一覧を取得（ステータス情報を含む）
const fetchJoinedTeams = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      loadingJoinedTeams.value = false
      return
    }

    const { data, error: fetchError } = await supabase
      .from('team_members')
      .select(`
        team_id,
        created_at,
        status,
        teams (
          id,
          team_name,
          team_logo_url
        )
      `)
      .eq('player_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Fetch joined teams error:', fetchError)
      loadingJoinedTeams.value = false
      return
    }

    joinedTeams.value = data || []
  } catch (err) {
    console.error('Error:', err)
  } finally {
    loadingJoinedTeams.value = false
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
    await Promise.all([
      fetchAvailableTeams(),
      fetchJoinedTeams()
    ])

  } catch (err) {
    error.value = 'エラーが発生しました'
    console.error('Join team error:', err)
  } finally {
    joiningTeamId.value = null
  }
}

// チーム再申請処理 (rejected -> pending)
const handleRejoinTeam = async (teamId: string, teamName: string) => {
  rejoiningTeamId.value = teamId
  error.value = ''
  success.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      error.value = 'ログインが必要です'
      rejoiningTeamId.value = null
      return
    }

    // team_membersのステータスをpendingに更新
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ 
        status: 'pending',
        // 再申請の日時を更新したい場合は、updated_atなどを設定できます
      })
      .eq('team_id', teamId)
      .eq('player_id', user.id)

    if (updateError) {
      error.value = 'チームへの再申請に失敗しました'
      console.error('Update error:', updateError)
      rejoiningTeamId.value = null
      return
    }

    // 成功
    success.value = `${teamName || 'チーム'}への参加を再申請しました！承認をお待ちください。`

    // 一覧を再取得
    await fetchJoinedTeams()

  } catch (err) {
    error.value = 'エラーが発生しました'
    console.error('Rejoin team error:', err)
  } finally {
    rejoiningTeamId.value = null
  }
}
// チームトップへ遷移（承認済みのみ）
const selectTeam = async (teamId: string) => {
  try {
    const { setTeamId } = useTeamSession()
    const success = await setTeamId(teamId)
    
    if (success) {
      await navigateTo('/team_info')
    } else {
      error.value = 'チーム情報の保存に失敗しました'
    }
  } catch (err) {
    console.error('Select team error:', err)
    error.value = 'エラーが発生しました'
  }
}

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// ページ読み込み時に実行
onMounted(async () => {
  await Promise.all([
    fetchAvailableTeams(),
    fetchJoinedTeams()
  ])
})

useHead({
  title: 'MatchMate - チーム参加',
  meta: [
    { name: 'description', content: 'チームに参加' }
  ]
})
</script>