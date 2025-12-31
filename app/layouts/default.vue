<script setup lang="ts">
  // ロール情報を取得
  const { role, isPlayer, isManager, isLoggedIn, fetchUserRole, logout } = useUserRole()
  
  // 現在のルートを取得
  const route = useRoute()
  
  // ページによって未ログイン時メニューを強制表示するかどうか
  const forceGuestMenu = computed(() => route.meta.forceGuestMenu === true)
  
  // 実際に表示するログイン状態（強制未ログイン表示の場合はfalse）
  const displayIsLoggedIn = computed(() => !forceGuestMenu.value && isLoggedIn.value)
  
  // ハンバーガーメニュー開閉状態
  const isMenuOpen = ref(false)
  
  // 初期ロール情報を取得
  onMounted(async () => {
    await fetchUserRole()
  })
  
  // ログアウト処理
  const handleLogout = async () => {
    isMenuOpen.value = false
    if (confirm('ログアウトしますか？')) {
      await logout()
    }
  }
  
  // メニューアイテムをクリックしたときメニューを閉じる
  const closeMenu = () => {
    isMenuOpen.value = false
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
  
          <!-- ヘッダー（固定） -->
          <header class="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
              <!-- ロゴと企業名 -->
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10">
                  <img src="@/assets/images/logo.png" alt="MatchMate" class="w-full h-full object-contain" />
                </div>
                <!--未ログイン時： トップページ-->
                <NuxtLink v-if="!displayIsLoggedIn" to="/" class="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                  MatchMate
                </NuxtLink>
                <!--ログイン時： チームトップページ-->
                <NuxtLink v-else to="/team_top" class="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                  MatchMate
                </NuxtLink>
              </div>
              
              <!-- 未ログイン時：ログイン・新規登録ボタン -->
              <div v-if="!displayIsLoggedIn" class="flex gap-2 sm:gap-3">
                <NuxtLink to="/login" class="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 font-medium hover:text-gray-900 transition text-center">
                  ログイン
                </NuxtLink>
                <NuxtLink to="/register" class="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-center">
                  新規登録
                </NuxtLink>
              </div>
              
              <!-- ログイン時：メニューバー（ロールに応じて表示） -->
              <div v-else class="flex items-center gap-2 sm:gap-4">
                <!-- ハンバーガーメニューボタン（スマホのみ） -->
                <button v-if="isPlayer || isManager" @click="isMenuOpen = !isMenuOpen" class="sm:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <!-- デスクトップ用メニュー（スマホでは非表示） -->
                <nav class="hidden sm:flex items-center gap-4">
                  <!-- 特定ページでログアウトのみ表示 -->
                  <template v-if="route.path === '/team_select' || route.path === '/team_join' || route.path === '/manager/teams/create'">
                    <button @click="handleLogout" class="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      ログアウト
                    </button>
                  </template>
                  
                  <!-- 選手用メニュー -->
                  <template v-else-if="isPlayer">
                    <NuxtLink to="/schedule" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      スケジュール
                    </NuxtLink>
                    <NuxtLink to="/profile" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      プロフィール
                    </NuxtLink>
                    <button @click="handleLogout" class="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      ログアウト
                    </button>
                  </template>
                  
                  <!-- 監督用メニュー -->
                  <template v-else-if="isManager">
                    <NuxtLink to="/schedule" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      スケジュール
                    </NuxtLink>
                    <NuxtLink to="/profile" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      プロフィール
                    </NuxtLink>
                    <NuxtLink to="/team_info" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      チーム・選手管理
                    </NuxtLink>
                    <button @click="handleLogout" class="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      ログアウト
                    </button>
                  </template>
                </nav>
              </div>
            </div>
          </header>
          
          <!-- スマホ用ドロップダウンメニュー -->
          <div v-if="isMenuOpen && displayIsLoggedIn" class="fixed top-[60px] left-0 right-0 bg-white border-b border-gray-200 shadow-md z-40 sm:hidden">
            <div class="px-4 py-4 space-y-2">
              <!-- 特定ページでログアウトのみ表示 -->
              <template v-if="route.path === '/team_select' || route.path === '/team_join' || route.path === '/manager/teams/create'">
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  ログアウト
                </button>
              </template>
              
              <!-- 選手用メニュー -->
              <template v-else-if="isPlayer">
                <NuxtLink to="/schedule" @click="closeMenu" class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  スケジュール
                </NuxtLink>
                <NuxtLink to="/profile" @click="closeMenu" class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  プロフィール
                </NuxtLink>
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  ログアウト
                </button>
              </template>
              
              <!-- 監督用メニュー -->
              <template v-else-if="isManager">
                <NuxtLink to="/schedule" @click="closeMenu" class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  スケジュール
                </NuxtLink>
                <NuxtLink to="/profile" @click="closeMenu" class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  プロフィール
                </NuxtLink>
                <NuxtLink to="/team_info" @click="closeMenu" class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  チーム・選手管理
                </NuxtLink>
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  ログアウト
                </button>
              </template>
            </div>
          </div>
          
          <!-- ハンバーガーメニュー開閉時のスペース調整 -->
          <div class="h-[60px] sm:h-[72px]"></div>
          
          <div class="relative z-10 flex-1 flex flex-col">
            <slot />
          </div>
          
          <!-- フッター -->
          <footer class="bg-gray-900 text-white py-8 relative z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- ロゴとキャッチコピー -->
                <div>
                  <div class="flex items-center gap-2 mb-4">
                    <div class="w-10 h-10">
                      <img src="@/assets/images/logo.png" alt="MatchMate" class="w-full h-full object-contain" />
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