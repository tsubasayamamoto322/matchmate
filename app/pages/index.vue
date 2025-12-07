<template>
  <div class="bg-gradient-to-b from-yellow-50 to-green-100 flex-1">
    <!-- メインコンテンツ -->
    <main class="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 min-h-screen flex items-center justify-center">
      <div class="max-w-7xl mx-auto w-full">
        <!-- モバイル版 (sm未満) -->
        <div class="sm:hidden">
          <div class="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <!-- サッカーフィールドの背景 -->
            <div class="absolute inset-0 bg-gradient-to-b from-green-400 via-green-500 to-green-600">
              <!-- 芝生のストライプ -->
              <div 
                class="absolute inset-0" 
                :style="{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 40px, transparent 40px, transparent 80px)' }"
              />
              
              <!-- 芝生のテクスチャ -->
              <div 
                class="absolute inset-0 opacity-40" 
                :style="{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.03) 1px, transparent 2px)' }"
              />
              
              <!-- センターライン -->
              <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white opacity-80 -translate-x-1/2" />
              
              <!-- センターサークル -->
              <div class="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white opacity-80 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div class="absolute left-1/2 top-1/2 w-2 h-2 bg-white opacity-80 rounded-full -translate-x-1/2 -translate-y-1/2" />
              
              <!-- ペナルティエリア左 -->
              <div class="absolute left-4 top-1/2 w-16 h-32 border-2 border-white border-r-0 opacity-60 -translate-y-1/2" />
              
              <!-- ペナルティエリア右 -->
              <div class="absolute right-4 top-1/2 w-16 h-32 border-2 border-white border-l-0 opacity-60 -translate-y-1/2" />
            </div>

            <!-- コンテンツ -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <!-- 上のボール -->
              <div class="relative animate-bounce mb-4" :style="{ animationDelay: '0s', animationDuration: '2.5s' }">
                <div class="text-5xl">⚽</div>
              </div>

              <!-- テキスト -->
              <div class="text-center z-10 mb-6">
                <h2 
                  class="text-4xl font-bold text-white mb-4" 
                  :style="{ textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)' }"
                >
                  MatchMate
                </h2>
              </div>

              <!-- ボタン -->
              <div class="relative z-20 flex flex-col gap-3">
                <NuxtLink to="login" class="px-6 py-2.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-lg text-sm text-center">
                  ログイン画面へ
                </NuxtLink>
                <NuxtLink to="register" class="px-6 py-2.5 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg text-sm text-center">
                  新規登録
                </NuxtLink>
              </div>

              <!-- 下のボール -->
              <div class="relative animate-bounce mt-6" :style="{ animationDelay: '0.5s', animationDuration: '2.5s' }">
                <div class="text-4xl">⚽</div>
              </div>
            </div>
          </div>
        </div>

        <!-- パソコン版 (sm以上) -->
        <div class="hidden sm:block">
          <div class="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
                <div class="flex flex-col gap-4">
                  <NuxtLink to="login" class="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                    ログイン画面へ
                  </NuxtLink>
                  <NuxtLink to="register" class="px-8 py-3 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-xl">
                    新規登録
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
      </div>
    </main>
  </div>
</template>

<script setup>
// このページでは未ログイン時メニューを強制表示
definePageMeta({
  forceGuestMenu: true
})
</script>