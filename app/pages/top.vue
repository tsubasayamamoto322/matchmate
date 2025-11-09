<template>
    <div>
        {{ userTeams }}
    </div>
</template>
<script setup>
import { createClient } from '@supabase/supabase-js'
import { isSetAccessorDeclaration } from 'typescript';

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 
const userData = await sessionFromUserData();
if(await sessionFromUserData() == 'error') {
    await navigateTo({path: "/error", query: {errorCode: '001'}})
}

const teamsIds = await getJoinTeamsId(userData);
const userJoinTeams = await getJoinTeams(teamsIds);
async function sessionFromUserData() {
    try{
        const { data } = await supabase.auth.getUser();
        if (data.user != null) {
            console.log(`if文の中身${await supabase.from("users").select().eq('id', data.user.id).single()}`)
            return await supabase.from("users").select().eq('id', data.user.id).single();
        }
    }catch(e){
        return 'error'
    }
}
async function getJoinTeamsId(userData) {
    if(userData != undefined && userData.error == null) {
        const teams = await supabase.from('team_members').select().eq('player_id',userData.data.id)
        return teams;
    }
}
async function getJoinTeams(teamsIds) {
    if(teamsIds != undefined && teamsIds.error == null) {
        // const teams = await supabase.from('teams').select().eq('id',teamsIds.id)
        console.log(teamsIds)
        return teams;
    }
}
</script>