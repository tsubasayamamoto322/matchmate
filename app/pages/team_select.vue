<template>
  <div class="flex flex-col flex-1">
    <!-- メインコンテンツ -->
    <main class="flex-1 p-8 flex items-center justify-center">
      <div class="w-full max-w-2xl">
          <div class="flex justify-between items-center mb-6">
            <div class="flex-1">
              <h2 class="text-gray-900 text-3xl font-bold mb-2">チームの選択</h2>
              <p class="text-gray-700 text-sm">
                {{ isManager ? '管理するチームを選択してください。' : '所属するチームを選択してください。' }}
              </p>
            </div>
            
            <!-- 監督専用：チーム新規作成ボタン -->
            <NuxtLink 
              v-if="isManager" 
              to="/manager/teams/create"
              class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              チームを新規作成
            </NuxtLink>
          </div>
          
          <div class="space-y-4">
            <button
              v-for="team in userJoinTeams.data"
              :key="team.id"
              @click="handleTeamSelect(team)"
              class="w-full bg-white rounded-xl shadow-xl p-6 flex gap-4 hover:shadow-2xl hover:scale-102 transition-all transform duration-200 border-2 border-transparent hover:border-green-400"
            >
              <div class="flex-shrink-0 relative">
                <div class="w-32 h-32 bg-gradient-to-br from-green-300 to-green-600 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    :src="team.team_logo_url || 'https://via.placeholder.com/128x128?text=Team'" 
                    :alt="team.team_name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg">⚽</div>
              </div>
              <div class="flex-1 text-left flex flex-col justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ team.team_name }}</h3>
                  <p class="text-gray-600 text-sm">{{ team.address }}</p>
                </div>
                <div class="flex gap-2 mt-4">
                  <button class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md">
                    選択
                  </button>
                </div>
              </div>
            </button>
          </div>
      </div>
    </main>
  </div>
</template>
  
<script setup lang="ts"> 
import { createClient } from '@supabase/supabase-js'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'

// ロール情報を取得
const { isManager, isPlayer, fetchUserRole, userData: userRoleData } = useUserRole()

const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 

// ページ読み込み時にチームデータを取得
const userData = await sessionFromUserData();
if(userData == 'error') {
    await navigateTo({path: "/error", query: {errorCode: '001'}})
}

// ロール情報を取得
await fetchUserRole()

// ユーザーの役割に応じてチームを取得
let userJoinTeams: any = { data: [] };
if (userData !== 'error' && userData?.data?.id) {
  if (isManager.value) {
    // 監督の場合：teamsテーブルからmanager_idが自分のIDと一致するものを取得
    userJoinTeams = await getManagerTeams(userData.data.id);
  } else {
    // 選手の場合：team_membersテーブルから参加しているチームを取得
    const teamsIds = await getJoinTeamsId(userData);
    userJoinTeams = await getJoinTeams(teamsIds);
  }
}

console.log(userJoinTeams)

async function sessionFromUserData() {
    try{
        const { data } = await supabase.auth.getUser();
        if (data.user != null) {
            return await supabase.from("users").select().eq('id', data.user.id).single();
        }
    }catch(e){
        return 'error'
    }
}

// 監督用：自分が管理しているチームを取得
async function getManagerTeams(managerId: string) {
    const teams = await supabase
      .from('teams')
      .select()
      .eq('manager_id', managerId)
    return teams;
}

// 選手用：参加しているチームのIDを取得
async function getJoinTeamsId(userData: any) {
    if(userData != undefined && userData.error == null) {
        const teams = await supabase.from('team_members').select().eq('player_id',userData.data.id)
        return teams;
    }
}

// 選手用：チームIDからチーム情報を取得
async function getJoinTeams(teamsIds: any) {
    if(teamsIds != undefined && teamsIds.error == null) {
        const arrTeamsIds: string[] = [];
        teamsIds.data.forEach((teamsId: any) => {
            arrTeamsIds.push(teamsId.team_id)
        })
        const teams = await supabase.from('teams').select().in('id',arrTeamsIds)
        return teams;
    }
}
  
const handleTeamSelect = async (team: any) => {
  console.log('Selected team:', team)
  await navigateTo({
    path: '/team_top',
    query: { team_id: team.id }
  })
}
  
  useHead({
    title: 'MatchMate - チーム選択',
    meta: [
      { name: 'description', content: 'MatchMateチーム選択' }
    ]
  })
  </script>