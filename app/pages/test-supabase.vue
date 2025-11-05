<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Supabase接続テスト</h1>
      
      <div class="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 class="text-xl font-semibold text-purple-600 mb-4">接続情報</h2>
        <div class="space-y-2">
          <div class="p-3 bg-gray-50 rounded-md">
            <strong class="text-purple-600">Supabase URL:</strong>
            <span class="ml-2">{{ supabaseUrl || '未設定' }}</span>
          </div>
          <div class="p-3 bg-gray-50 rounded-md">
            <strong class="text-purple-600">Anon Key:</strong>
            <span class="ml-2">{{ anonKey ? `${anonKey.substring(0, 20)}...` : '未設定' }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 class="text-xl font-semibold text-purple-600 mb-4">認証テスト</h2>
        <div class="space-y-3 mb-4">
          <input 
            v-model="testEmail" 
            type="email" 
            placeholder="メールアドレス"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input 
            v-model="testPassword" 
            type="password" 
            placeholder="パスワード"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button 
            @click="testAuth" 
            class="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            認証テスト
          </button>
        </div>
        
        <div v-if="authResult" class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold mb-2">結果:</h3>
          <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{{ JSON.stringify(authResult, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 class="text-xl font-semibold text-purple-600 mb-4">現在の認証状態</h2>
        <div class="space-y-3">
          <p><strong>ログイン状態:</strong> {{ isLoggedIn ? 'ログイン中' : '未ログイン' }}</p>
          <div v-if="user" class="bg-gray-50 rounded-lg p-4">
            <p class="mb-2"><strong>ユーザーID:</strong> {{ user.id }}</p>
            <p><strong>メール:</strong> {{ user.email }}</p>
          </div>
          <button 
            v-if="isLoggedIn" 
            @click="signOut" 
            class="px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
      
      <div class="flex gap-4">
        <NuxtLink 
          to="/" 
          class="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
        >
          トップページへ
        </NuxtLink>
        <NuxtLink 
          to="/login" 
          class="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
        >
          ログインページへ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabase()
const user = useSupabaseUser()

const testEmail = ref('')
const testPassword = ref('')
const authResult = ref<any>(null)

const isLoggedIn = computed(() => !!user.value)

const supabaseUrl = computed(() => {
  const config = useRuntimeConfig()
  return config.public.supabase?.url
})

const anonKey = computed(() => {
  const config = useRuntimeConfig()
  return config.public.supabase?.key
})

const testAuth = async () => {
  if (!testEmail.value || !testPassword.value) {
    alert('メールアドレスとパスワードを入力してください')
    return
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail.value,
      password: testPassword.value,
    })
    
    authResult.value = {
      success: !error,
      error: error ? error.message : null,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
      } : null,
    }
  } catch (err) {
    authResult.value = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

const signOut = async () => {
  await supabase.auth.signOut()
  authResult.value = null
}

useHead({
  title: 'MatchMate - Supabase Test',
})
</script>
