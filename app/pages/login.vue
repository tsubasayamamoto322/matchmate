<template>
  <div class="bg-gradient-to-b from-green-400 to-green-600 flex flex-col flex-1">
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
  </div>
</template>

<script setup lang="ts"> 
import { createClient } from '@supabase/supabase-js'

// このページでは未ログイン時メニューを強制表示
definePageMeta({
  forceGuestMenu: true
})

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
  await navigateTo({path: '/team_select'})
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