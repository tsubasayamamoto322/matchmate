<template>
    <div>
        <ul>
            <li v-for="team in userJoinTeams.data" :key="team.id">
              {{ team.team_name }}
            </li>
          </ul>
    </div>
</template>
<script setup>
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 
const userData = await sessionFromUserData();
if(await sessionFromUserData() == 'error') {
    await navigateTo({path: "/error", query: {errorCode: '001'}})
}

const teamsIds = await getJoinTeamsId(userData);

const userJoinTeams = await getJoinTeams(teamsIds);
console.log(userJoinTeams)
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
        const arrTeamsIds = [];
        console.log(teamsIds)
        teamsIds.data.forEach((teamsId) => {
            arrTeamsIds.push(teamsId.team_id)
        })
        console.log(arrTeamsIds)
        const teams = await supabase.from('teams').select().in('id',arrTeamsIds)
        console.log(teams)
        return teams;
    }
}
</script>
