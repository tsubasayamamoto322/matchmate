<script setup lang="ts">
import logo from '~/assets/images/logo.png'

useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: logo },
    { rel: 'shortcut icon', type: 'image/png', href: logo },
    { rel: 'apple-touch-icon', href: logo },
  ],
})
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>