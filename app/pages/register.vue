<template>
  <div class="bg-gradient-to-b from-green-400 to-green-600 flex flex-col flex-1">
    <!-- メインコンテンツ -->
    <main class="flex-1 p-4 sm:p-8 flex items-center justify-center">
      <div class="w-full max-w-md">
        <div class="mb-4">
          <h1 class="text-white text-2xl font-bold">新規登録</h1>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-8 shadow-2xl">
          <div class="flex items-center justify-center gap-2 mb-6 text-green-700 text-2xl font-bold">
            <span class="w-10 h-10 bg-green-700 text-white rounded-lg flex items-center justify-center font-bold">M</span>
            <span>MatchMate</span>
          </div>
          
          <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-800 mb-1">ユーザー名</label>
              <input 
                id="username"
                v-model="username" 
                type="text"
                placeholder="山田太郎"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-800 mb-2">プロフィール画像（任意）</label>
              <div class="flex items-center gap-4">
                <div class="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="プロフィール画像" class="w-full h-full object-cover" />
                  <div v-else class="text-2xl text-white font-bold">
                    {{ username.charAt(0) || '？' }}
                  </div>
                </div>
                <div class="flex-grow">
                  <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
                  <button type="button" @click="fileInput?.click()"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium cursor-pointer">
                    ファイルを選択
                  </button>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF (最大5MB)</p>
                </div>
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-800 mb-1">Email</label>
              <input 
                id="email"
                v-model="email" 
                type="email"
                placeholder="example@email.com"
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
                placeholder="8文字以上"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                minlength="8"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-800 mb-1">Password(確認)</label>
              <input 
                id="confirmPassword"
                v-model="confirmPassword" 
                type="password"
                placeholder="パスワードを再入力"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                minlength="8"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-800 mb-2">ロール選択</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  class="relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  :class="selectedRole === 'manager' ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white hover:border-green-400'"
                >
                  <input 
                    type="radio" 
                    v-model="selectedRole" 
                    value="manager"
                    class="sr-only"
                    required
                  />
                  <div class="text-3xl mb-2">👔</div>
                  <span class="text-sm font-semibold text-gray-800">監督</span>
                  <div 
                    v-if="selectedRole === 'manager'"
                    class="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </label>
                <label 
                  class="relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  :class="selectedRole === 'player' ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white hover:border-green-400'"
                >
                  <input 
                    type="radio" 
                    v-model="selectedRole" 
                    value="player"
                    class="sr-only"
                    required
                  />
                  <div class="text-3xl mb-2">⚽</div>
                  <span class="text-sm font-semibold text-gray-800">選手</span>
                  <div 
                    v-if="selectedRole === 'player'"
                    class="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full mt-2 py-3 bg-gray-700 text-white rounded-lg text-base font-bold transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {{ loading ? '登録中...' : 'Sign Up' }}
            </button>
          </form>
          
          <div class="mt-4">
            <NuxtLink to="/login" class="text-green-700 text-sm text-left underline hover:text-green-800">
              既にアカウントをお持ちの方はこちら
            </NuxtLink>
          </div>
          
          <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>
          
          <div v-if="success" class="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
            {{ success }}
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

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedRole = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

// ファイル選択処理
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // ファイルサイズチェック (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'ファイルサイズは5MB以下にしてください'
    return
  }

  // ファイルタイプチェック
  if (!file.type.startsWith('image/')) {
    error.value = '画像ファイルを選択してください'
    return
  }

  avatarFile.value = file

  // プレビュー表示
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  error.value = ''
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  // バリデーション
  if (password.value !== confirmPassword.value) {
    error.value = 'パスワードが一致しません'
    loading.value = false
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'パスワードは8文字以上で入力してください'
    loading.value = false
    return
  }
  
  if (!selectedRole.value) {
    error.value = 'ロールを選択してください'
    loading.value = false
    return
  }
  
  try {
    // Supabase Authでユーザー登録
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          user_name: username.value,
          role: selectedRole.value
        }
      }
    })
    
    if (signUpError) {
      error.value = signUpError.message
      console.error('Sign up error:', signUpError)
      loading.value = false
      return
    }
    
    if (!authData?.user) {
      error.value = '登録に失敗しました'
      console.error('No user data returned')
      loading.value = false
      return
    }

    // メール確認が必要な場合とそうでない場合で処理を分ける
    const needsEmailConfirmation = authData.user.identities?.length === 0

    if (needsEmailConfirmation) {
      // メール確認が必要な場合
      success.value = '登録メールを送信しました。メールを確認してアカウントを有効化してください。'
      
      setTimeout(async () => {
        await navigateTo({ path: '/login' })
      }, 5000)
    } else {
      // メール確認不要、またはすでに確認済みの場合
      let avatarUrl: string | null = null

      // アバター画像がある場合、アップロード
      if (avatarFile.value) {
        const fileExt = avatarFile.value.name.split('.').pop()
        const fileName = `avatars/${authData.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('team-logos')
          .upload(fileName, avatarFile.value)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          error.value = `画像のアップロードに失敗しました: ${uploadError.message}`
          loading.value = false
          return
        }

        // 公開URLを取得
        const { data: urlData } = supabase.storage
          .from('team-logos')
          .getPublicUrl(fileName)

        avatarUrl = urlData.publicUrl
        console.log('Avatar uploaded:', avatarUrl)
      }

      console.log('Registering user with data:', {
        id: authData.user.id,
        email: email.value,
        user_name: username.value,
        role: selectedRole.value,
        avatar_url: avatarUrl
      })

      // usersテーブルにユーザー情報を登録
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: email.value,
          user_name: username.value,
          role: selectedRole.value,
          avatar_url: avatarUrl
        }, {
          onConflict: 'id'
        })
        .select()
      
      if (insertError) {
        error.value = 'ユーザー情報の登録に失敗しました: ' + insertError.message
        console.error('Insert error:', insertError)
        console.error('Insert error details:', insertError)
        loading.value = false
        return
      }

      console.log('User registered successfully:', insertData)
      
      // 登録成功
      success.value = '登録が完了しました。画面を移動します。'
      
      setTimeout(async () => {
        // ロールに応じて遷移先を変更
        if (selectedRole.value === 'player') {
          await navigateTo({ path: '/team_join' })
        } else {
          await navigateTo({ path: '/login' })
        }
      }, 3000)
    }
    
  } catch (err: any) {
    error.value = '登録に失敗しました: ' + (err.message || '')
    console.error('Registration error:', err)
    loading.value = false
  }
}

useHead({
  title: 'MatchMate - 新規登録',
  meta: [
    { name: 'description', content: 'MatchMateの新規登録' }
  ]
})
</script>