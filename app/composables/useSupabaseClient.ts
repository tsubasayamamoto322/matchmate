import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

/**
 * グローバルに1つだけのSupabaseクライアントを取得
 * 複数のクライアントインスタンス生成を防ぐ
 */
export const useSupabaseClient = () => {
  if (!supabaseInstance) {
    const config = useRuntimeConfig()
    supabaseInstance = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  }
  return supabaseInstance
}

