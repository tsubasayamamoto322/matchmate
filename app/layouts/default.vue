<script setup lang="ts">
// ロール情報を取得
const { role, isPlayer, isManager, isLoggedIn, fetchUserRole, logout } = useUserRole()

// 現在のルートを取得
const route = useRoute()

// ページによって未ログイン時メニューを強制表示するかどうか
const forceGuestMenu = computed(() => route.meta.forceGuestMenu === true)

// 実際に表示するログイン状態（強制未ログイン表示の場合はfalse）
const displayIsLoggedIn = computed(() => !forceGuestMenu.value && isLoggedIn.value)

// 初期ロール情報を取得
onMounted(async () => {
  await fetchUserRole()
})

// ログアウト処理
const handleLogout = async () => {
  if (confirm('ログアウトしますか？')) {
    await logout()
  }
}
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <!-- ログイン後用背景（forceGuestMenuが false の場合のみ表示） -->
        <div v-if="!forceGuestMenu" class="fixed inset-0 z-0">
          <!-- グラデーション背景 -->
          <div class="absolute inset-0 bg-gradient-to-b from-lime-50 to-lime-100"></div>
          
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

            <!-- 選手アイコン装飾 -->
            <div class="absolute top-16 left-1/4 opacity-30 animate-bounce">
              <svg class="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="3"></circle>
                <rect x="11" y="10" width="2" height="8"></rect>
                <rect x="6" y="13" width="3" height="5"></rect>
                <rect x="15" y="13" width="3" height="5"></rect>
              </svg>
            </div>
            <div class="absolute bottom-20 right-1/4 opacity-25 animate-pulse">
              <svg class="w-14 h-14 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="3"></circle>
                <rect x="11" y="10" width="2" height="8"></rect>
                <rect x="4" y="12" width="3" height="6"></rect>
                <rect x="17" y="12" width="3" height="6"></rect>
              </svg>
            </div>
          </div>
        </div>

        <!-- ヘッダー -->
        <header class="bg-white shadow-sm relative z-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                </svg>
              </div>
              <NuxtLink to="/" class="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">MatchMate</NuxtLink>
            </div>
            
            <!-- 未ログイン時：ログイン・新規登録ボタン -->
            <div v-if="!displayIsLoggedIn" class="flex gap-3">
              <NuxtLink to="/login" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                ログイン
              </NuxtLink>
              <button class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                新規登録
              </button>
            </div>
            
            <!-- ログイン時：メニューバー（ロールに応じて表示） -->
            <nav v-else class="flex items-center gap-4">
              <!-- 選手用メニュー -->
              <template v-if="isPlayer">
                <NuxtLink to="/schedule" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  スケジュール
                </NuxtLink>
                <NuxtLink to="/player/profile" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  プロフィール
                </NuxtLink>
                <button @click="handleLogout" class="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  ログアウト
                </button>
              </template>
              
              <!-- 監督用メニュー -->
              <template v-else-if="isManager">
                <NuxtLink :to="{ path: '/schedule', query: { team_id: route.query.team_id } }" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  スケジュール
                </NuxtLink>
                <NuxtLink to="/manager/teams" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  チーム管理
                </NuxtLink>
                <NuxtLink to="/manager/players" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  選手管理
                </NuxtLink>
                <button @click="handleLogout" class="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  ログアウト
                </button>
              </template>
            </nav>
          </div>
        </header>
        
        <div class="relative z-10 flex-1 flex flex-col">
          <slot />
        </div>
        
        <!-- フッター -->
        <footer class="bg-gray-900 text-white py-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- ロゴとキャッチコピー -->
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

              <!-- リンク -->
              <div>
                <h3 class="font-bold mb-4">サービス</h3>
                <ul class="space-y-2 text-sm text-gray-400">
                  <li><NuxtLink to="/about" class="hover:text-white transition-colors">MatchMateとは</NuxtLink></li>
                  <li><NuxtLink to="/features" class="hover:text-white transition-colors">機能紹介</NuxtLink></li>
                  <li><NuxtLink to="/pricing" class="hover:text-white transition-colors">料金プラン</NuxtLink></li>
                </ul>
              </div>

              <!-- サポート -->
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

            <!-- コピーライト -->
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 MatchMate. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </div>
</template>

<style>
</style>