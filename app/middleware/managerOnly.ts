/**
 * 監督専用ページへのアクセス制御ミドルウェア
 * 選手がアクセスした場合はリダイレクト
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { role, isManager, fetchUserRole } = useUserRole()
  
  // ロール情報を取得
  await fetchUserRole()
  
  // 監督でない場合はリダイレクト
  if (!isManager.value) {
    return navigateTo('/')
  }
})

