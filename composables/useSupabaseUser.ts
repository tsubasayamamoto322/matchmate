import { ref, onMounted } from 'vue'
import { useSupabase } from './useSupabase'

export const useSupabaseUser = () => {
  const user = ref(null)
  const supabase = useSupabase()
  
  onMounted(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  })
  
  return user
}

