
<template>
    <div style="min-height: 100vh; background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%); padding: 2rem; display: flex; align-items: center; justify-content: center;">
      <div style="width: 100%; max-width: 28rem;">
        <div style="margin-bottom: 1rem;">
          <h1 style="color: white; font-size: 1.5rem; font-weight: bold;">ログイン</h1>
        </div>
        
        <div style="background: #f0f9ff; border-radius: 0.5rem; padding: 2rem; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; color: #9333ea; font-size: 1.5rem; font-weight: bold;">
            <span style="width: 2.5rem; height: 2.5rem; background: #9333ea; color: white; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-weight: bold;">M</span>
            <span>MatchMate</span>
          </div>
          
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-radius: 0.5rem; overflow: hidden; background: white; padding: 4px;">
            <label 
              v-for="role in roles" 
              :key="role.value"
              :style="[
                'flex: 1; padding: 0.75rem; text-align: center; cursor: pointer; transition: all 0.3s; border-radius: 0.375rem; position: relative;',
                selectedRole === role.value ? 'background: #9333ea; color: white;' : 'color: #374151;'
              ]"
              @click="selectedRole = role.value"
            >
              <input 
                type="radio" 
                :value="role.value" 
                v-model="selectedRole"
                style="position: absolute; opacity: 0; width: 0; height: 0;"
              />
              {{ role.label }}
            </label>
          </div>
          
          <form @submit.prevent="consoleTest" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label for="email" style="display: block; font-size: 0.875rem; font-weight: 500; color: #333; margin-bottom: 0.25rem;">Email</label>
              <input 
                id="email"
                v-model="email" 
                type="email"
                placeholder="Value"
                style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;"
                required
              />
            </div>
            
            <div>
              <label for="password" style="display: block; font-size: 0.875rem; font-weight: 500; color: #333; margin-bottom: 0.25rem;">Password</label>
              <input 
                id="password"
                v-model="password" 
                type="password"
                placeholder="Value"
                style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;"
                required
              />
            </div>
            
            <button 
              type="submit" 
              :disabled="loading"
              style="width: 100%; margin-top: 0.5rem; padding: 0.875rem; background: #4a5568; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.3s;"
            >
              {{ loading ? 'ログイン中...' : 'Sign In' }}
            </button>
          </form>
          
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
            <button 
              type="button"
              @click="handleForgotPassword"
              style="color: #9333ea; font-size: 0.875rem; text-align: left; background: none; border: none; cursor: pointer; text-decoration: underline;"
            >
              パスワードを忘れた場合
            </button>
            <NuxtLink to="/register" style="color: #9333ea; font-size: 0.875rem; text-align: left; text-decoration: underline;">
              新規登録はこちら
            </NuxtLink>
          </div>
          
          <div v-if="error" style="margin-top: 1rem; padding: 0.75rem; background: #fee; color: #c33; border-radius: 0.5rem; font-size: 0.875rem;">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { createClient } from "@supabase/supabase-js"
import { ref } from 'vue';
const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  
const consoleTest = () => {
    console.log("正常通りに動作")
}
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
    console.log("handleLoginが呼び出されました")
    loading.value = true
    error.value = ''
    
    try {
        debugger;
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (loginError) {
        error.value = loginError.message
        throw new Error('ログイン処理失敗')
      }
      
      if (data.user) {
        if (selectedRole.value === 'player') {
          await navigateTo('/player/top')
        } else {
          await navigateTo('/manager/top')
        }
      }
    } catch (err) {
      error.value = 'ログインに失敗しました'
      console.error('Login error:', err)
    } finally {
      loading.value = false
    }
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
  