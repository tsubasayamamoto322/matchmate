<template>
    <div>
        {{ user }}
    </div>
</template>
<script setup>
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 

try {
    const { data } = await supabase.auth.getUser();
    const loginUserId = data.user.id;
    const user  = await supabase.from("users").select().eq('id', loginUserId).single();
} catch(error) {

}
</script>