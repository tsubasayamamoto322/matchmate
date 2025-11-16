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
        <!-- ヘッダー -->
        <header class="bg-white shadow-sm">
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
                <NuxtLink to="/schedule" class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
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
        
        <slot />
        
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