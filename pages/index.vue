<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%); padding: 2rem;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h1 style="color: white; font-size: 1.5rem; font-weight: bold;">ホームペーシ</h1>
      </div>
      
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; color: white; font-size: 1.875rem; font-weight: bold;">
        <span style="width: 3rem; height: 3rem; background: white; color: #9333ea; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-weight: bold;">M</span>
        <span>MatchMate</span>
      </div>
      
      <div style="position: relative; width: 100%; height: 500px; border-radius: 0.75rem; overflow: hidden; margin-bottom: 2rem;">
        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); filter: blur(4px); position: relative;">
          <div style="position: absolute; top: 10%; left: 10%; width: 5rem; height: 5rem; background: white; border-radius: 9999px; opacity: 0.3;"></div>
          <div style="position: absolute; top: 20%; right: 15%; width: 4rem; height: 4rem; background: white; border-radius: 9999px; opacity: 0.25;"></div>
        </div>
        <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.3);"></div>
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10;">
          <h2 style="color: white; font-size: 3.75rem; font-weight: bold; text-align: center; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">MatchMate</h2>
        </div>
      </div>
      
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <NuxtLink 
          to="/login" 
          style="background: white; color: #9333ea; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: bold; text-decoration: none; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"
        >
          ログイン
        </NuxtLink>
        <NuxtLink 
          to="/login" 
          style="background: white; color: #9333ea; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: bold; text-decoration: none; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"
        >
          新規作成
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'MatchMate - Top Page',
  meta: [
    { name: 'description', content: 'スポーツのリーグ戦などの出欠管理アプリ' }
  ]
})
</script>
