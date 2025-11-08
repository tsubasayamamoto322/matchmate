<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-50 to-green-100">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">MatchMate</h1>
        </div>
        
        <div class="flex gap-3">
          <NuxtLink to="login" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            ログイン
          </NuxtLink>
          <button class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            新規登録
          </button>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="w-full px-4 sm:px-6 lg:px-8 py-16 h-150">
      <div class="max-w-7xl mx-auto">
        <div class="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
          <!-- サッカーフィールドの背景 -->
          <div class="absolute inset-0 bg-gradient-to-b from-green-400 via-green-500 to-green-600">
            <!-- 芝生のストライプ -->
            <div 
              class="absolute inset-0" 
              :style="{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 80px, transparent 80px, transparent 160px)' }"
            />
            
            <!-- 芝生のテクスチャ -->
            <div 
              class="absolute inset-0 opacity-40" 
              :style="{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.03) 1px, transparent 2px)' }"
            />
            
            <!-- センターライン -->
            <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-white opacity-80 -translate-x-1/2" />
            
            <!-- センターサークル -->
            <div class="absolute left-1/2 top-1/2 w-32 h-32 border-4 border-white opacity-80 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div class="absolute left-1/2 top-1/2 w-3 h-3 bg-white opacity-80 rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            <!-- ペナルティエリア左 -->
            <div class="absolute left-8 top-1/2 w-24 h-40 border-4 border-white border-r-0 opacity-60 -translate-y-1/2" />
            
            <!-- ペナルティエリア右 -->
            <div class="absolute right-8 top-1/2 w-24 h-40 border-4 border-white border-l-0 opacity-60 -translate-y-1/2" />
          </div>

          <!-- コンテンツ -->
          <div class="absolute inset-0 flex items-center justify-center gap-8">
            <!-- 左のボール -->
            <div class="relative animate-bounce" :style="{ animationDelay: '0s', animationDuration: '3s' }">
              <div class="text-8xl">⚽</div>
            </div>

            <!-- 中央のテキスト -->
            <div class="text-center z-10">
              <h2 
                class="text-5xl font-bold text-white mb-6" 
                :style="{ textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)' }"
              >
                MatchMate
              </h2>
              <div class="inline-block bg-white bg-opacity-90 px-6 py-3 rounded-lg mb-8">
                <p class="text-gray-900 text-lg font-medium">
                  試合をつなげる
                </p>
              </div>
              <div>
                <NuxtLink to="login" class="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                  ログイン画面へ
                </NuxtLink>
              </div>
            </div>

            <!-- 右のボール -->
            <div class="relative animate-bounce" :style="{ animationDelay: '1s', animationDuration: '3s' }">
              <div class="text-8xl">⚽</div>
            </div>
          </div>

          <!-- 下部のボール -->
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" :style="{ animationDelay: '0.5s', animationDuration: '2.5s' }">
            <div class="text-6xl">⚽</div>
          </div>
        </div>
      </div>
    </main>
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

<script setup>
// Nuxt 3 Composition API
</script>