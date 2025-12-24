<template>
  <div class="flex flex-col flex-1">
    <!-- メインコンテンツ -->
    <main class="flex-1 p-8">
      <div class="w-full max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <div class="flex-1">
              <h2 class="text-gray-900 text-3xl font-bold mb-2">チームの選択</h2>
              <p class="text-gray-700 text-sm">
                {{ isManager ? '管理するチームを選択してください。' : '参加しているチームを選択してください。' }}
              </p>
            </div>
            
            <div class="flex gap-3">
              <!-- 選手専用：チームに参加ボタン -->
              <button
                v-if="!isManager"
                @click="navigateTo('/team_join')"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                チームに参加
              </button>

              <!-- 監督専用：チーム新規作成ボタン -->
              <NuxtLink 
                v-if="isManager" 
                to="/manager/teams/create"
                class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                チームを新規作成
              </NuxtLink>
            </div>
          </div>

          <!-- エラーメッセージ -->
          <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- 承認済みチーム一覧 -->
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">参加中のチーム</h3>
            
            <div v-if="approvedTeams.length === 0" class="text-center py-8">
              <div class="mb-4 text-6xl">⚽</div>
              <p class="text-gray-500">参加しているチームがありません</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="team in approvedTeams"
                :key="team.id"
                @click="selectTeam(team)"
                class="w-full bg-white rounded-xl shadow-lg p-6 flex gap-4 hover:shadow-2xl transition-all transform duration-200 border-2 border-transparent hover:border-green-400 cursor-pointer"
              >
                <div class="flex-shrink-0 relative">
                  <div class="w-32 h-32 bg-gradient-to-br from-green-300 to-green-600 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      :src="team.team_logo_url || 'https://via.placeholder.com/128x128?text=Team'" 
                      :alt="team.team_name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg">⚽</div>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ team.team_name }}</h3>
                    <p class="text-gray-600 text-sm">{{ team.address }}</p>
                  </div>
                  <div class="flex gap-2 mt-4">
                    <div class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md">
                      選択
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 参加申請待機中・拒否されたチーム一覧（選手のみ） -->
          <div v-if="!isManager" class="bg-white rounded-xl shadow-lg p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">参加申請待機中</h3>
            
            <div v-if="pendingTeams.length === 0 && rejectedTeams.length === 0" class="text-center py-8">
              <p class="text-gray-500">申請中のチームはありません</p>
            </div>

            <div v-else class="space-y-4">
              <!-- 承認待ちチーム -->
              <div
                v-for="team in pendingTeams"
                :key="`pending-${team.team_id}`"
                class="bg-yellow-50 rounded-xl p-6 flex gap-4 border-2 border-yellow-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      :src="team.teams?.team_logo_url || 'https://via.placeholder.com/96x96?text=Team'" 
                      :alt="team.teams?.team_name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ team.teams?.team_name }}</h3>
                    <p class="text-gray-600 text-sm">{{ team.teams?.address }}</p>
                  </div>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      ⏱ 承認待ち
                    </span>
                    <p class="text-sm text-gray-500">申請日: {{ formatDate(team.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- 拒否されたチーム -->
              <div
                v-for="team in rejectedTeams"
                :key="`rejected-${team.team_id}`"
                class="bg-red-50 rounded-xl p-6 flex gap-4 border-2 border-red-200"
              >
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 bg-gradient-to-br from-red-300 to-red-600 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      :src="team.teams?.team_logo_url || 'https://via.placeholder.com/96x96?text=Team'" 
                      :alt="team.teams?.team_name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ team.teams?.team_name }}</h3>
                    <p class="text-gray-600 text-sm">{{ team.teams?.address }}</p>
                  </div>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      ✕ 拒否
                    </span>
                    <p class="text-sm text-gray-500">申請日: {{ formatDate(team.created_at) }}</p>
                  </div>
                  <div class="flex gap-2 mt-3">
                    <button
                      @click="handleReapply(team.team_id)"
                      :disabled="reapplyingTeamId === team.team_id || deletingTeamId === team.team_id"
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ reapplyingTeamId === team.team_id ? '再申請中...' : '再申請' }}
                    </button>
                    <button
                      @click="handleDeleteApplication(team.team_id)"
                      :disabled="reapplyingTeamId === team.team_id || deletingTeamId === team.team_id"
                      class="px-4 py-2 bg-gray-400 text-white text-sm font-bold rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ deletingTeamId === team.team_id ? '削除中...' : '削除' }}
                    </button>
                  </div>
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
import type { PostgrestSingleResponse } from '@supabase/supabase-js'

// ロール情報を取得
const { isManager, isPlayer, fetchUserRole, userData: userRoleData } = useUserRole()

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 

// 初期状態
const approvedTeams = ref<any[]>([])
const pendingTeams = ref<any[]>([])
const rejectedTeams = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const reapplyingTeamId = ref<string | null>(null)
const deletingTeamId = ref<string | null>(null)

// 非同期処理を onMounted で実行
onMounted(async () => {
  try {
    // ページ読み込み時にチームデータを取得
    const userData = await sessionFromUserData();
    
    // ユーザーデータが取得できない場合（null、undefined、'error'）はエラーページへ
    if (!userData || userData === 'error' || !userData?.data?.id) {
        await navigateTo({path: "/error", query: {errorCode: '001'}})
        return
    }

    // ロール情報を取得
    await fetchUserRole()

    // ユーザーの役割に応じてチームを取得
    if (isManager.value) {
      // 監督の場合：teamsテーブルからmanager_idが自分のIDと一致するものを取得
      const result = await getManagerTeams(userData.data.id);
      approvedTeams.value = result?.data || []
    } else {
      // 選手の場合：team_membersテーブルから参加しているチームを取得
      const { approved, pending, rejected } = await getPlayerTeams(userData.data.id);
      approvedTeams.value = approved
      pendingTeams.value = pending
      rejectedTeams.value = rejected
    }
  } catch (err) {
    error.value = 'チーム情報の読み込みに失敗しました'
    console.error('Error loading teams:', err)
  } finally {
    isLoading.value = false
  }
})

/**
 * ユーザー認証情報とユーザーテーブルのデータを取得
 * @returns Supabaseレスポンス | 'error' | null
 */
async function sessionFromUserData() {
    try{
        const { data } = await supabase.auth.getUser();
        // ユーザーが認証されていない場合は明示的に null を返す
        if (!data.user) {
            console.warn('No authenticated user found');
            return null;
        }
        // ユーザーテーブルからデータを取得
        return await supabase.from("users").select().eq('id', data.user.id).single();
    }catch(e){
        console.error('Error fetching session data:', e);
        return 'error'
    }
}

// 監督用：自分が管理しているチームを取得
async function getManagerTeams(managerId: string) {
    const teams = await supabase
      .from('teams')
      .select()
      .eq('manager_id', managerId)
    return teams || { data: [] };
}

// 選手用：承認済み、承認待ち、拒否されたチームを分けて取得
async function getPlayerTeams(playerId: string) {
    try {
        // team_membersから全ての参加チーム情報を取得
        const { data: memberData, error: memberError } = await supabase
            .from('team_members')
            .select(`
                team_id,
                status,
                created_at,
                teams (
                    id,
                    team_name,
                    team_logo_url,
                    address
                )
            `)
            .eq('player_id', playerId)

        if (memberError || !memberData) {
            console.error('Error fetching team members:', memberError)
            return { approved: [], pending: [], rejected: [] }
        }

        // ステータスに基づいて分けます
        const approved = memberData
            .filter((member: any) => member.status === 'approved')
            .map((member: any) => member.teams)

        const pending = memberData
            .filter((member: any) => member.status === 'pending')

        const rejected = memberData
            .filter((member: any) => member.status === 'rejected')

        return { approved, pending, rejected }
    } catch (err) {
        console.error('Error getting player teams:', err)
        return { approved: [], pending: [], rejected: [] }
    }
}
  
const handleTeamSelect = async (team: any) => {
  console.log('Selected team:', team)
  await navigateTo({
    path: '/team_top'
  })
}
  
useHead({
  title: 'MatchMate - チーム選択',
  meta: [
    { name: 'description', content: 'MatchMateチーム選択' }
  ]
})

const { setTeamId } = useTeamSession()

const selectTeam = async (team: any) => {
  const user = await sessionFromUserData();
  try {
    if (!user) {
      throw new Error('ユーザー認証エラー')
    }

    // セッションにチーム情報を保存
    const success = await setTeamId(team.id)
    if (!success) {
      throw new Error('チーム情報のセッション保存に失敗しました')
    }

    console.log('Team ID saved to session:', team.id)
    await navigateTo("/team_top")

  } catch (err) {
    console.error('チーム選択エラー:', err)
    error.value = 'チーム選択処理でエラーが発生しました'
  }
}

// 再申請処理
const handleReapply = async (teamId: string) => {
  reapplyingTeamId.value = teamId
  error.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      error.value = 'ログインが必要です'
      reapplyingTeamId.value = null
      return
    }

    // ステータスをpendingに更新
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ status: 'pending' })
      .eq('team_id', teamId)
      .eq('player_id', user.id)

    if (updateError) {
      error.value = '再申請に失敗しました'
      console.error('Update error:', updateError)
      reapplyingTeamId.value = null
      return
    }

    // 一覧を再取得
    const userData = await sessionFromUserData()
    if (userData && userData !== 'error' && userData.data?.id) {
      const { approved, pending, rejected } = await getPlayerTeams(userData.data.id)
      approvedTeams.value = approved
      pendingTeams.value = pending
      rejectedTeams.value = rejected
    }

  } catch (err) {
    error.value = '再申請処理でエラーが発生しました'
    console.error('Reapply error:', err)
  } finally {
    reapplyingTeamId.value = null
  }
}

// 申請削除処理
const handleDeleteApplication = async (teamId: string) => {
  deletingTeamId.value = teamId
  error.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      error.value = 'ログインが必要です'
      deletingTeamId.value = null
      return
    }

    // rejected状態の申請を削除
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('player_id', user.id)
      .eq('status', 'rejected')

    if (deleteError) {
      error.value = '削除に失敗しました'
      console.error('Delete error:', deleteError)
      deletingTeamId.value = null
      return
    }

    // 一覧を再取得
    const userData = await sessionFromUserData()
    if (userData && userData !== 'error' && userData.data?.id) {
      const { approved, pending, rejected } = await getPlayerTeams(userData.data.id)
      approvedTeams.value = approved
      pendingTeams.value = pending
      rejectedTeams.value = rejected
    }

  } catch (err) {
    error.value = '削除処理でエラーが発生しました'
    console.error('Delete error:', err)
  } finally {
    deletingTeamId.value = null
  }
}

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
</script>