import tailwindcss from "@tailwindcss/vite";
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
    '@nuxtjs/tailwindcss',
    '@tailwindcss/postcss',
    'autoprefixer',
  ],
  
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@auth/core'
      ]
    },
    plugins:[
      tailwindcss()
    ]
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
  tailwindcss: {
       cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }], // Default
       config: {
         content: [
           "~/components/**/*.{js,vue,ts}",
           "~/app/layouts/**/*.vue",
           "~/app/pages/**/*.vue",
           "~/plugins/**/*.{js,ts}",
           "~/app/app.vue",
           "~/app/error.vue",
         ],
       },
       viewer: true,
     },
     css: ['~/assets/css/tailwind.css']
})