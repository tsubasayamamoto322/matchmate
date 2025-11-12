<template>
    <div class="min-h-screen bg-gradient-to-b from-lime-50 to-lime-100 flex flex-col">
      <!-- ヘッダー -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2">
          <div class="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
            </svg>
          </div>
          <NuxtLink to="/" class="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">MatchMate</NuxtLink>
        </div>
      </header>
  
      <!-- メインコンテンツ -->
      <main class="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
        <!-- サッカーフィールド背景 -->
        <div class="absolute inset-0">
          <!-- グラデーション背景 -->
          <div class="absolute inset-0 bg-gradient-to-b from-emerald-400 via-green-500 to-green-600"></div>
          
          <!-- フィールドパターン -->
          <div class="absolute inset-0 opacity-15">
            <div class="absolute inset-0" style="background-image: repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px); background-size: 70px 70px;"></div>
          </div>
  
          <!-- メインフィールド枠 -->
          <div class="absolute inset-0 m-12 border-4 border-white rounded-3xl opacity-30"></div>
  
          <!-- センターライン -->
          <div class="absolute top-0 bottom-0 left-1/2 w-1 bg-white opacity-40 transform -translate-x-1/2"></div>
  
          <!-- センターサークル -->
          <div class="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
  
          <!-- キックオフスポット -->
          <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
  
          <!-- 左ゴール -->
          <div class="absolute top-1/2 left-12 w-2 h-20 border-4 border-white rounded-lg transform -translate-y-1/2 opacity-40"></div>
          <div class="absolute top-1/2 left-20 w-6 h-32 border-4 border-white rounded-lg transform -translate-y-1/2 opacity-30"></div>
  
          <!-- 右ゴール -->
          <div class="absolute top-1/2 right-12 w-2 h-20 border-4 border-white rounded-lg transform -translate-y-1/2 opacity-40"></div>
          <div class="absolute top-1/2 right-20 w-6 h-32 border-4 border-white rounded-lg transform -translate-y-1/2 opacity-30"></div>
  
          <!-- 装飾的なサッカーボール -->
          <div class="absolute top-20 right-20 text-6xl opacity-20 animate-pulse">⚽</div>
          <div class="absolute bottom-32 left-16 text-8xl opacity-15 animate-bounce">⚽</div>
          <div class="absolute top-1/3 left-1/4 text-7xl opacity-10">⚽</div>
  
          <!-- 選手アイコン装飾（白黒シルエット） -->
          <!-- GK（ゴールキーパー） -->
          <div class="absolute top-16 left-1/4 opacity-30 animate-bounce">
            <svg class="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="3"></circle>
              <rect x="11" y="10" width="2" height="8"></rect>
              <rect x="6" y="13" width="3" height="5"></rect>
              <rect x="15" y="13" width="3" height="5"></rect>
            </svg>
          </div>
          <!-- DF（ディフェンダー） -->
          <div class="absolute top-24 right-1/4 opacity-25 animate-pulse">
            <svg class="w-14 h-14 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="3"></circle>
              <rect x="11" y="10" width="2" height="8"></rect>
              <rect x="4" y="12" width="3" height="6"></rect>
              <rect x="17" y="12" width="3" height="6"></rect>
            </svg>
          </div>
          <!-- MF（ミッドフィルダー） -->
          <div class="absolute bottom-20 left-1/3 opacity-20">
            <svg class="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="4" r="2.5"></circle>
              <rect x="11" y="9" width="2" height="7"></rect>
              <rect x="6" y="12" width="3" height="5"></rect>
              <rect x="15" y="12" width="3" height="5"></rect>
            </svg>
          </div>
          <!-- FW（フォワード） -->
          <div class="absolute bottom-32 right-1/3 opacity-25 animate-bounce">
            <svg class="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="3"></circle>
              <rect x="11" y="10" width="2" height="8"></rect>
              <rect x="7" y="13" width="3" height="5"></rect>
              <rect x="14" y="13" width="3" height="5"></rect>
            </svg>
          </div>
        </div>
  
        <div class="w-full max-w-2xl relative z-10">
          <h2 class="text-gray-900 text-3xl font-bold mb-2 text-center">チームの選択</h2>
          <p class="text-gray-700 text-sm mb-8 text-center">所属するチームを選択してください。</p>
          
          <div class="space-y-4">
            <button
              v-for="team in userJoinTeams.data"
              :key="team.id"
              @click="handleTeamSelect(team)"
              class="w-full bg-white rounded-xl shadow-xl p-6 flex gap-4 hover:shadow-2xl hover:scale-102 transition-all transform duration-200 border-2 border-transparent hover:border-green-400"
            >
              <div class="flex-shrink-0 relative">
                <div class="w-32 h-32 bg-gradient-to-br from-green-300 to-green-600 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://via.placeholder.com/128x128?text=Team" 
                    :alt="team.team_name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg">⚽</div>
              </div>
              <div class="flex-1 text-left flex flex-col justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ team.team_name }}</h3>
                  <p class="text-gray-600 text-sm">チームのスケジュールと管理します。</p>
                </div>
                <div class="flex gap-2 mt-4">
                  <button class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md">
                    選択
                  </button>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
  
      <!-- フッター -->
      <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                  </svg>
                </div>
                <span class="text-xl font-bold">MatchMate</span>
              </div>
              <p class="text-gray-400 text-sm">
                サッカーの試合を簡単に見つけて、つながろう
              </p>
            </div>
  
            <div>
              <h3 class="font-bold mb-4">サービス</h3>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><NuxtLink to="/about" class="hover:text-white transition-colors">MatchMateとは</NuxtLink></li>
                <li><NuxtLink to="/features" class="hover:text-white transition-colors">機能紹介</NuxtLink></li>
                <li><NuxtLink to="/pricing" class="hover:text-white transition-colors">料金プラン</NuxtLink></li>
              </ul>
            </div>
  
            <div>
              <h3 class="font-bold mb-4">サポート</h3>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><NuxtLink to="/help" class="hover:text-white transition-colors">ヘルプセンター</NuxtLink></li>
                <li><NuxtLink to="/terms" class="hover:text-white transition-colors">利用規約</NuxtLink></li>
                <li><NuxtLink to="/privacy" class="hover:text-white transition-colors">プライバシーポリシー</NuxtLink></li>
                <li><NuxtLink to="/contact" class="hover:text-white transition-colors">お問い合わせ</NuxtLink></li>
              </ul>
            </div>
          </div>
  
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 MatchMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts"> 
  import { createClient } from '@supabase/supabase-js'
  
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 
  
  // ページ読み込み時にチームデータを取得
  const userData = await sessionFromUserData();
  if(userData == 'error') {
      await navigateTo({path: "/error", query: {errorCode: '001'}})
  }
  
  const teamsIds = await getJoinTeamsId(userData);
  const userJoinTeams = await getJoinTeams(teamsIds);
  console.log(userJoinTeams)
  
  async function sessionFromUserData() {
      try{
          const { data } = await supabase.auth.getUser();
          if (data.user != null) {
              return await supabase.from("users").select().eq('id', data.user.id).single();
          }
      }catch(e){
          return 'error'
      }
  }
  
  async function getJoinTeamsId(userData) {
      if(userData != undefined && userData.error == null) {
          const teams = await supabase.from('team_members').select().eq('player_id',userData.data.id)
          return teams;
      }
  }
  
  async function getJoinTeams(teamsIds) {
      if(teamsIds != undefined && teamsIds.error == null) {
          const arrTeamsIds = [];
          teamsIds.data.forEach((teamsId) => {
              arrTeamsIds.push(teamsId.team_id)
          })
          const teams = await supabase.from('teams').select().in('id',arrTeamsIds)
          return teams;
      }
  }
  
  const handleTeamSelect = async (team) => {
    console.log('Selected team:', team)
    await navigateTo({path: '/top'})
  }
  
  useHead({
    title: 'MatchMate - チーム選択',
    meta: [
      { name: 'description', content: 'MatchMateチーム選択' }
    ]
  })
  </script>