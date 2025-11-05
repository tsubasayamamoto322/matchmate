<script setup>
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

const instruments = ref([])
async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data
}
onMounted(() => {
  getInstruments()
})
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>