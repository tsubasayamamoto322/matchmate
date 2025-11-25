<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { ref, computed, onMounted } from 'vue';

// ロール情報を取得
const { role, isPlayer, isManager, fetchUserRole } = useUserRole()
// 初期ロール情報を取得
onMounted(async () => {
  await fetchUserRole()
})
const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey) 

// ===================================
// 1. データ構造 (Gamesテーブルに基づく)
// ===================================

interface Match {
  id: string; 
  team_id: string;
  game_date: string;
  game_time: string;
  opponent_team: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// データのreactiveな定義
const futureMatches = ref<Match[]>([]); 
const pastMatches = ref<Match[]>([]);

// ===================================
// 2. ロジック (タブ切り替えと日時整形)
// ===================================
const activeTab = ref<'future' | 'past'>('future');
const activeTabClass = 'bg-white border-b-2 border-blue-500 font-semibold text-gray-800';
const inactiveTabClass = 'text-gray-500 hover:text-gray-700 transition duration-150';

const currentMatches = computed(() => {
  return activeTab.value === 'future' ? futureMatches.value : pastMatches.value;
});

const formatMatchDateTime = (match: Match): string => {
  if (!match.game_date || !match.game_time) return '日時未定';

  try {
    const dateTime = new Date(`${match.game_date}T${match.game_time}`); 
    
    const datePart = new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateTime);

    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const ampm = hour < 12 ? '午前' : '午後';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; 

    return `${datePart} ${ampm}${formattedHour}時${minute.toString().padStart(2, '0')}分`;
  } catch (e) {
    return `${match.game_date} ${match.game_time}`;
  }
};



//Supabaseから試合データをフェッチし、未来と過去に分類する関数
const fetchMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user.id;
    const { data: teamMemberData, error: teamMemberError } = await supabase
            .from('team_members')
            .select('team_id')
            .eq('player_id', currentUserId) // ログインユーザーIDで検索
            .eq('status', 'approved') // 承認済試合に限定
            .single();
    const currentTeamId = teamMemberData.team_id;
    console.log('id:',currentTeamId)
    // 現在時刻のDateオブジェクト
    const now = new Date(); 
    const todayDate = now.toISOString().substring(0, 10); // 今日の日付 'YYYY-MM-DD'

    // ----------------------------------------------------
    // 1. 今日以降の日付のデータを全て取得 (未来・今日の試合)
    // ----------------------------------------------------
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('team_id', currentTeamId)
        .gt('game_date', todayDate)
        .order('game_time', { ascending: true });

    if (error) {
        console.error('試合データフェッチエラー:', error);
        return;
    }
    
    const allMatches = data as Match[];
    const future: Match[] = [];
    const past: Match[] = [];

    // ----------------------------------------------------
    // 2. クライアント側で分類
    // ----------------------------------------------------
    allMatches.forEach(match => {
        const matchDateTime = new Date(`${match.game_date}T${match.game_time}`);
        
        if (matchDateTime > now) {
            future.push(match);
        } else {
            past.push(match); // 今日の過去の試合
        }
    });
    // ----------------------------------------------------
    // 3. 過去の日付のデータを全て取得 (昨日の試合以前)
    // ----------------------------------------------------
    const { data: pastData, error: pastError } = await supabase
        .from('games')
        .select('*')
        .eq('team_id', currentTeamId)
        .lt('game_date', todayDate) // 今日より過去の日付を取得
        .order('game_date', { ascending: false }) // 新しい順に降順ソート
        .order('game_time', { ascending: false });

    if (pastError) {
        console.error('過去の試合データフェッチエラー:', pastError);
        return;
    }

    // 最終的な過去の試合リストを生成・ソート
    const finalPastMatches = (pastData as Match[]).concat(past);
    finalPastMatches.sort((a, b) => {
        const dateA = new Date(`${a.game_date}T${a.game_time}`);
        const dateB = new Date(`${b.game_date}T${b.game_time}`);
        return dateB.getTime() - dateA.getTime();
    });

    // reactiveな変数に代入
    futureMatches.value = future;
    pastMatches.value = finalPastMatches;
};


// 初期ロール情報を取得し、試合データをフェッチ
onMounted(async () => {
  await fetchUserRole()
  await fetchMatches()
})
</script>

<template>
  <div class="flex-1">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">スケジュール</h1>
      
      <div class="flex border-b border-gray-300 mb-8">
        <button
          @click="activeTab = 'future'"
          :class="['px-6 py-2 text-sm', activeTab === 'future' ? activeTabClass : inactiveTabClass]"
        >
          今後の試合
        </button>
        <button
          @click="activeTab = 'past'"
          :class="['px-6 py-2 text-sm', activeTab === 'past' ? activeTabClass : inactiveTabClass]"
        >
          過去の試合
        </button>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          {{ activeTab === 'future' ? '今後の試合' : '過去の試合' }}
        </h2>

        <div class="bg-white rounded-lg shadow-md divide-y divide-gray-100">
          <template v-if="currentMatches.length">
            <div 
              v-for="match in currentMatches" 
              :key="match.id" 
              class="flex items-center p-3 border-b border-gray-200 last:border-b-0"
            >
              <div class="w-12 h-12 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                <div class="w-full h-full bg-gray-300 flex items-center justify-center">
                </div>
              </div>

              <div class="flex-grow">
                <div class="text-sm font-semibold text-gray-800">
                  試合名 <span class="font-normal text-gray-600">対戦相手: **{{ match.opponent_team }}**</span>
                </div>

                <div class="text-xs text-gray-500 mt-0.5">
                  **{{ formatMatchDateTime(match) }}**
                </div>

                <div v-if="match.location" class="text-xs text-gray-500">
                  場所: {{ match.location }}
                </div>

                <div v-if="match.notes" class="text-xs text-gray-500 italic">
                  備考: {{ match.notes }}
                </div>
              </div>
              <button
                v-if="isPlayer"
                class="ml-4 px-3 py-1 text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-full hover:bg-blue-100 transition duration-150"
              >
                {{ activeTab === 'future' ? '出欠席の回答' : '試合結果を見る' }}
              </button>
              
                            <div v-else-if="isManager" class="ml-4 flex gap-2">
              <button
                v-if="activeTab === 'future'"
                class="px-3 py-1 text-sm text-green-600 border border-green-200 bg-green-50 rounded-full hover:bg-green-100 transition duration-150"
              >
                出欠状況を確認
              </button>
              <button
                v-else
                class="px-3 py-1 text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-full hover:bg-blue-100 transition duration-150"
              >
                試合結果を入力
              </button>
              </div>
            </div>
          </template>
          
                    <template v-else>
            <p class="p-4 text-gray-600">
              {{ activeTab === 'future' ? '今後の試合の予定はありません。' : '過去の試合情報はありません。' }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>