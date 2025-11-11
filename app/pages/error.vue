<template>
  <div class="min-h-screen bg-gradient-to-b from-red-400 to-red-600 flex flex-col">
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
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-1 p-8 flex items-center justify-center">
      <div class="w-full max-w-md">
        <div class="mb-4">
          <h1 class="text-white text-2xl font-bold">エラー</h1>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-8 shadow-2xl">
          <div class="flex items-center justify-center gap-2 mb-6 text-red-700 text-2xl font-bold">
            <span class="w-10 h-10 bg-red-700 text-white rounded-lg flex items-center justify-center font-bold">M</span>
            <span>MatchMate</span>
          </div>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 class="text-red-800 font-semibold mb-3 text-lg">エラー内容:</h2>
            <div class="bg-white rounded p-4 border border-red-100">
              <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">{{ errorContent }}</p>
            </div>
          </div>
          
          <div class="flex flex-col gap-3">
            <NuxtLink 
              to="/" 
              class="w-full py-3 px-4 bg-red-600 text-white rounded-lg text-center font-bold hover:bg-red-700 transition-colors"
            >
              ホームに戻る
            </NuxtLink>
            
            <NuxtLink 
              to="/login" 
              class="w-full py-3 px-4 bg-gray-700 text-white rounded-lg text-center font-bold hover:bg-gray-800 transition-colors"
            >
              ログインページに戻る
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

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

<script setup>
import { useRoute } from 'vue-router' // Nuxtは自動インポートしてくれることが多いですが、明示しても良い
let errorContent = 'エラーが発生しました'
const route = useRoute() 
const queryParam = route.query.errorCode
useHead({
  title: 'エラー - MatchMate',
  meta: [
    { name: 'description', content: 'エラーが発生しました' }
  ]
})
if (queryParam == '001') {
    errorContent = "セッションが切れました。再ログインが必要です。"
}
</script>