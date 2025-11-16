<script setup lang="ts">

</script>

<template>
    <div class="min-h-screen flex flex-col">
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