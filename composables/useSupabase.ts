import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabase?.url
  const supabaseKey = config.public.supabase?.key
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be set in environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

