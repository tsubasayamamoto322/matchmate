// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
  ],
  
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  },
  
  runtimeConfig: {
    // サーバーサイドでのみ利用するシークレット（例: サービスロールキーなど）

    public: {
      // フロントエンドにも公開する情報
      // Supabaseモジュールが探す構造でURLとKeyを設定します。
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY,
      }
    }
  },
})