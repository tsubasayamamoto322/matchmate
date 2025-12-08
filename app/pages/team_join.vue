<template>
    <div class="flex flex-col flex-1">
      <main class="flex-1 p-8">
        <div class="max-w-4xl mx-auto">
          <!-- ヘッダー -->
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">チームに参加</h1>
            <p class="text-gray-600">参加コードを入力してチームに参加しましょう</p>
          </div>
  
          <!-- 参加コード入力フォーム -->
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <form @submit.prevent="handleJoinTeam" class="space-y-6">
              <div>
                <label for="joinCode" class="block text-sm font-medium text-gray-700 mb-2">
                  参加コード <span class="text-red-500">*</span>
                </label>
                <input 
                  id="joinCode"
                  v-model="joinCode" 
                  type="text"
                  placeholder="例: ABC123"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                />
                <p class="text-xs text-gray-500 mt-2">※ 監督から共有された6桁の参加コードを入力してください</p>
              </div>
  
              <!-- エラーメッセージ -->
              <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {{ error }}
              </div>
  
              <!-- 成功メッセージ -->
              <div v-if="success" class="p-4 bg-green-50 text-green-600 rounded-lg text-sm">
                {{ success }}
              </div>
  
              <!-- ボタン -->
              <div class="flex gap-3">
                <button 
                  type="submit" 
                  :disabled="loading || !joinCode"
                  class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ loading ? '参加中...' : 'チームに参加' }}
                </button>
              </div>
            </form>
          </div>
  
          <!-- 参加済みチーム一覧 -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">参加中のチーム</h2>
  
            <div v-if="loadingTeams" class="text-center py-8">
              <p class="text-gray-500">読み込み中...</p>
            </div>
  
            <div v-else-if="joinedTeams.length === 0" class="text-center py-8">
              <div class="mb-4 text-6xl">⚽</div>
              <p class="text-gray-500">まだチームに参加していません</p>
              <p class="text-sm text-gray-400 mt-2">上記の参加コードを入力してチームに参加しましょう</p>
            </div>
  
            <div v-else class="space-y-4">
              <div 
                v-for="team in joinedTeams" 
                :key="team.team_id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <!-- チームロゴ -->
                  <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                    <img v-if="team.teams?.logo_url" :src="team.teams.logo_url" :alt="team.teams.team_name" class="w-full h-full object-cover" />
                    <span v-else class="text-2xl text-white font-bold">{{ team.teams?.team_name?.charAt(0) || 'T' }}</span>
                  </div>
                  
                  <!-- チーム情報 -->
                  <div>
                    <h3 class="font-bold text-gray-900 text-lg">{{ team.teams?.team_name || '不明なチーム' }}</h3>
                    <p class="text-sm text-gray-600">参加日: {{ formatDate(team.joined_at) }}</p>
                  </div>
                </div>
  
                <NuxtLink 
                  :to="`/team_top?team_id=${team.team_id}`"
                  class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  チームトップへ
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
  
  const joinCode = ref('')
  const loading = ref(false)
  const loadingTeams = ref(true)
  const error = ref('')
  const success = ref('')
  const joinedTeams = ref<any[]>([])
  
  // チーム参加処理
  const handleJoinTeam = async () => {
    if (!joinCode.value) return
    
    loading.value = true
    error.value = ''
    success.value = ''
  
    try {
      // 現在のユーザーを取得
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        error.value = 'ログインが必要です'
        loading.value = false
        return
      }
  
      // 参加コードでチームを検索
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id, team_name')
        .eq('join_code', joinCode.value.toUpperCase())
        .single()
  
      if (teamError || !team) {
        error.value = '参加コードが正しくありません'
        console.error('Team search error:', teamError)
        loading.value = false
        return
      }
  
      // 既に参加しているかチェック
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single()
  
      if (existingMember) {
        error.value = '既にこのチームに参加しています'
        loading.value = false
        return
      }
  
      // チームメンバーに追加
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          joined_at: new Date().toISOString()
        })
  
      if (insertError) {
        error.value = 'チームへの参加に失敗しました'
        console.error('Insert error:', insertError)
        loading.value = false
        return
      }
  
      // 成功
      success.value = `${team.team_name}に参加しました！`
      joinCode.value = ''
      
      // チーム一覧を再取得
      await fetchJoinedTeams()
  
      // 3秒後にチームトップに遷移
      setTimeout(() => {
        navigateTo({ path: '/team_top', query: { team_id: team.id } })
      }, 2000)
  
    } catch (err) {
      error.value = 'エラーが発生しました'
      console.error('Join team error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // 参加中のチーム一覧を取得
  const fetchJoinedTeams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
  
      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          joined_at,
          teams (
            id,
            team_name,
            logo_url
          )
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
  
      if (fetchError) {
        console.error('Fetch teams error:', fetchError)
        return
      }
  
      joinedTeams.value = data || []
    } catch (err) {
      console.error('Error:', err)
    } finally {
      loadingTeams.value = false
    }
  }
  
  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
  
  // ページ読み込み時に実行
  onMounted(async () => {
    await fetchJoinedTeams()
  })
  
  useHead({
    title: 'MatchMate - チーム参加',
    meta: [
      { name: 'description', content: 'チームに参加' }
    ]
  })
  </script>