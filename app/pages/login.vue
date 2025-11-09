<template>
  <div class="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex flex-col">
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
        <h1 class="text-white text-2xl font-bold">ログイン</h1>
      </div>
      
      <div class="bg-yellow-50 rounded-lg p-8 shadow-2xl">
        <div class="flex items-center justify-center gap-2 mb-6 text-green-700 text-2xl font-bold">
          <span class="w-10 h-10 bg-green-700 text-white rounded-lg flex items-center justify-center font-bold">M</span>
          <span>MatchMate</span>
        </div>
        
        <div class="flex gap-2 mb-6 rounded-lg overflow-hidden bg-white p-1">
          <label 
            v-for="role in roles" 
            :key="role.value"
            class="flex-1 p-3 text-center cursor-pointer transition-all rounded-md relative"
            :class="selectedRole === role.value ? 'bg-green-600 text-white' : 'text-gray-700'"
            @click="selectedRole = role.value"
          >
            <input 
              type="radio" 
              :value="role.value" 
              v-model="selectedRole"
              class="absolute opacity-0 w-0 h-0"
            />
            {{ role.label }}
          </label>
        </div>
        
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email"
              placeholder="Value"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password"
              placeholder="Value"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full mt-2 py-3 bg-gray-700 text-white rounded-lg text-base font-bold cursor-pointer transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'ログイン中...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="flex flex-col gap-2 mt-4">
          <button 
            type="button"
            @click="handleForgotPassword"
            class="text-green-700 text-sm text-left bg-transparent border-0 cursor-pointer underline hover:text-green-800"
          >
            パスワードを忘れた場合
          </button>
          <NuxtLink to="/register" class="text-green-700 text-sm text-left underline hover:text-green-800">
            新規登録はこちら
          </NuxtLink>
        </div>
        
        <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ error }}
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

<script setup lang="ts"> 
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 

const email = ref('')
const password = ref('')
const selectedRole = ref('player')
const loading = ref(false)
const error = ref('')

const roles = [
  { value: 'player', label: '選手' },
  { value: 'manager', label: '監督' }
]

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (loginError) {
      error.value = loginError.message
      throw new Error('ログイン処理失敗')
    }
  } catch (err) {
    error.value = 'ログインに失敗しました'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
  await navigateTo({path: '/top'})
}

const handleForgotPassword = async () => {
  if (!email.value) {
    error.value = 'メールアドレスを入力してください'
    return
  }
  
  try {
    const { error: forgotError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (forgotError) {
      error.value = forgotError.message
    } else {
      alert('パスワードリセット用のメールを送信しました')
    }
  } catch (err) {
    error.value = 'パスワードリセットの送信に失敗しました'
    console.error('Forgot password error:', err)
  }
}

useHead({
  title: 'MatchMate - Login',
  meta: [
    { name: 'description', content: 'MatchMateにログイン' }
  ]
})
</script>