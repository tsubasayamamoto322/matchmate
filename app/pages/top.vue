<template>
    <div class="fixed inset-0 bg-slate-950 z-0"></div>
    <div class="relative z-10 min-h-screen w-screen bg-slate-950 overflow-y-auto">
  
      <!-- ヘッダー -->
      <header class="relative z-50 backdrop-blur-md bg-white/10 border-b border-white/10 sticky top-0">
        <div class="px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center max-w-7xl mx-auto">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">⚽</div>
              <h1 class="text-2xl font-bold text-white">MatchMate</h1>
            </div>
            <button @click="handleLogout" class="px-6 py-2 text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200">
              ログアウト
            </button>
          </div>
        </div>
      </header>
  
      <!-- メインコンテンツ -->
      <main class="relative z-10 px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <!-- ウェルカムセクション -->
        <div class="mb-16">
          <h2 class="text-5xl lg:text-6xl font-bold text-white mb-4">{{ user.teamName }}へようこそ 👋</h2>
          <p class="text-xl text-white/60">今週のスケジュールと出席状況を確認</p>
        </div>
  
        <!-- 出席状況サマリー -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div class="group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-6 transition-all duration-300">
            <p class="text-white/70 text-sm font-medium mb-3">参加</p>
            <p class="text-5xl font-bold text-white">{{ attendanceSummary.attended }}</p>
            <div class="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300"></div>
          </div>
          <div class="group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-6 transition-all duration-300">
            <p class="text-white/70 text-sm font-medium mb-3">欠席</p>
            <p class="text-5xl font-bold text-white">{{ attendanceSummary.absent }}</p>
            <div class="h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300"></div>
          </div>
          <div class="group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-6 transition-all duration-300">
            <p class="text-white/70 text-sm font-medium mb-3">未定</p>
            <p class="text-5xl font-bold text-white">{{ attendanceSummary.pending }}</p>
            <div class="h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300"></div>
          </div>
          <div class="group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-6 transition-all duration-300">
            <p class="text-white/70 text-sm font-medium mb-3">合計</p>
            <p class="text-5xl font-bold text-white">{{ attendanceSummary.total }}</p>
            <div class="h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300"></div>
          </div>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 今週の試合 -->
          <div class="lg:col-span-2">
            <div class="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 class="text-3xl font-bold text-white mb-8">📅 今週の試合</h3>
  
              <div class="space-y-4">
                <div v-if="games.length === 0" class="text-center py-20">
                  <div class="text-6xl mb-4">⚽</div>
                  <p class="text-white/60 text-lg">今週の試合はまだ登録されていません</p>
                </div>
  
                <div 
                  v-for="game in games"
                  :key="game.id"
                  class="group backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="font-bold text-white text-xl mb-2">{{ game.team_name }}</h4>
                      <p class="text-white/60">{{ formatDate(game.game_date) }}</p>
                    </div>
                    <span :class="['px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4 transition-all', getStatusBadge(game.attendance_status)]">
                      {{ getStatusText(game.attendance_status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- サイドバー -->
          <div class="space-y-6">
            <!-- クイックアクション -->
            <div class="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 class="text-2xl font-bold text-white mb-6">⚡ クイックアクション</h3>
              <div class="space-y-3">
                <button class="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl transform hover:scale-105">
                  試合に参加
                </button>
                <button class="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl transform hover:scale-105">
                  スケジュール確認
                </button>
                <button class="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl transform hover:scale-105">
                  プロフィール設定
                </button>
              </div>
            </div>
  
            <!-- ユーザー情報 -->
            <div class="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h4 class="text-xl font-bold text-white mb-6">👤 ユーザー情報</h4>
              <div class="space-y-4">
                <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p class="text-xs text-white/50 font-medium mb-2">ユーザーID</p>
                  <p class="text-sm font-mono text-white/90 break-all">{{ user.id }}</p>
                </div>
                <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p class="text-xs text-white/50 font-medium mb-2">役割</p>
                  <p class="text-sm font-bold text-cyan-400">{{ user.role }}</p>
                </div>
                <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p class="text-xs text-white/50 font-medium mb-2">チームID</p>
                  <p class="text-sm font-mono text-white/90 break-all">{{ user.teamId }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { createClient } from '@supabase/supabase-js'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  
  const games = ref([])
  const attendanceSummary = ref({
    attended: 0,
    absent: 0,
    pending: 0,
    total: 0
  })
  
  // ユーザー情報
  const { data } = await supabase.auth.getSession()
  const user = {
    id: data.session.user.id,
    role: data.session.user.role,
    teamId: data.session.user.user_metadata?.teamId || 'Not selected'
  }
  
  // ゲームデータとアテンダンス情報を取得
  const fetchGameData = async () => {
    try {
      const { data: attendances, error } = await supabase
        .from('attendances')
        .select(`
          id,
          game_id,
          player_id,
          attendance_status,
          roster_status,
          position,
          games (
            id,
            team_id,
            game_date,
            teams (
              team_name
            )
          )
        `)
        .eq('player_id', user.id)
        .order('game_date', { ascending: false })
  
      if (error) throw error
  
      // ゲーム情報をフォーマット
      games.value = attendances.map(att => ({
        id: att.game_id,
        team_name: att.games?.teams?.team_name || 'チーム名なし',
        game_date: att.games?.game_date,
        attendance_status: att.attendance_status,
        roster_status: att.roster_status,
        position: att.position
      }))
  
      // 出席状況のサマリーを計算
      calculateSummary(attendances)
  
    } catch (err) {
      console.error('ゲームデータ取得エラー:', err)
    }
  }
  
  // 出席状況のサマリーを計算
  const calculateSummary = (attendances) => {
    attendanceSummary.value = {
      attended: attendances.filter(a => a.attendance_status === 'attended').length,
      absent: attendances.filter(a => a.attendance_status === 'absent').length,
      pending: attendances.filter(a => a.attendance_status === 'pending').length,
      total: attendances.length
    }
  }
  
  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // ステータスバッジ
  const getStatusBadge = (status) => {
    switch (status) {
      case 'attended':
        return 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
      case 'absent':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
      case 'pending':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
    }
  }
  
  // ステータステキスト
  const getStatusText = (status) => {
    switch (status) {
      case 'attended':
        return '参加'
      case 'absent':
        return '欠席'
      case 'pending':
        return '未定'
      default:
        return '不明'
    }
  }
  
  // ログアウト
  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.push('/login')
  }
  
  onMounted(() => {
    fetchGameData()
  })
  

  </script>