import { createClient } from '@supabase/supabase-js'

export type UserRole = 'player' | 'manager' | null

interface UserData {
  id: string
  role: UserRole
  [key: string]: any
}

/**
 * ユーザーのロール情報を取得するcomposable
 * キャッシュ機能付きでパフォーマンスを最適化
 */
export const useUserRole = () => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  
  // キャッシュ用の状態
  const userData = ref<UserData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  /**
   * 現在のユーザー情報とロールを取得
   */
  const fetchUserRole = async (): Promise<UserRole> => {
    // 既にキャッシュされている場合はそれを返す
    if (userData.value) {
      return userData.value.role
    }
    
    loading.value = true
    error.value = null
    
    try {
      // 認証ユーザーを取得
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        return null
      }
      
      // usersテーブルからユーザー情報を取得
      const { data, error: dbError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', authUser.id)
        .single()
      
      if (dbError || !data) {
        error.value = dbError?.message || 'ユーザー情報の取得に失敗しました'
        return null
      }
      
      // キャッシュに保存
      userData.value = {
        id: data.id,
        role: data.role as UserRole
      }
      
      return data.role as UserRole
    } catch (err) {
      error.value = 'ロール情報の取得に失敗しました'
      console.error('Error fetching user role:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * キャッシュをクリア（ログアウト時などに使用）
   */
  const clearCache = () => {
    userData.value = null
    error.value = null
  }
  
  /**
   * ユーザーが選手かどうか
   */
  const isPlayer = computed(() => userData.value?.role === 'player')
  
  /**
   * ユーザーが監督かどうか
   */
  const isManager = computed(() => userData.value?.role === 'manager')
  
  /**
   * ログインしているかどうか
   */
  const isLoggedIn = computed(() => !!userData.value)
  
  // 認証状態の変更を監視してキャッシュをクリア
  onMounted(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearCache()
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // 認証状態が変わったらキャッシュをクリアして再取得
        clearCache()
        fetchUserRole()
      }
    })
  })
  
  return {
    userData: readonly(userData),
    role: computed(() => userData.value?.role ?? null),
    isPlayer,
    isManager,
    isLoggedIn,
    loading: readonly(loading),
    error: readonly(error),
    fetchUserRole,
    clearCache
  }
}

