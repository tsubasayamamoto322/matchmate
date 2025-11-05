// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],
  
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@auth/core'
      ]
    }
  },
  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    // サーバーサイドでのみ利用するシークレット（例: サービスロールキーなど）

    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },
})