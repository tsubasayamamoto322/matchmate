<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { ref, computed, onMounted, watch } from 'vue';

// ロール情報を取得
const { role, isPlayer, isManager, fetchUserRole } = useUserRole()
const { getTeamId } = useTeamSession()
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
  // セッションからチームIDを取得
  let currentTeamId = await getTeamId();
  
  if (!currentTeamId) {
    // セッションにない場合はユーザーのチームを使用
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const currentUserId = user.id;
      const { data: teamMemberData, error: teamMemberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('player_id', currentUserId) // ログインユーザーIDで検索
        .eq('status', 'approved') // 承認済試合に限定
        .single();
      if (teamMemberData) {
        currentTeamId = teamMemberData.team_id;
      }
    }
  }
  
  console.log('Team ID:', currentTeamId)
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
    .gte('game_date', todayDate)
    .order('game_date', { ascending: false })
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
    .order('game_date', { ascending: true }) // 古い順に昇順ソート
    .order('game_time', { ascending: true });

  if (pastError) {
    console.error('過去の試合データフェッチエラー:', pastError);
    return;
  }

  // 最終的な過去の試合リストを生成・ソート（最新から古い順）
  const finalPastMatches = (pastData as Match[]).concat(past);
  finalPastMatches.sort((a, b) => {
    const dateA = new Date(`${a.game_date}T${a.game_time}`);
    const dateB = new Date(`${b.game_date}T${b.game_time}`);
    return dateB.getTime() - dateA.getTime();
  });

  // 未来の試合もソート（最新から古い順）
  future.sort((a, b) => {
    const dateA = new Date(`${a.game_date}T${a.game_time}`);
    const dateB = new Date(`${b.game_date}T${b.game_time}`);
    return dateA.getTime() - dateB.getTime();
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
        <button @click="activeTab = 'future'"
          :class="['px-6 py-2 text-sm', activeTab === 'future' ? activeTabClass : inactiveTabClass]">
          今後の試合
        </button>
        <button @click="activeTab = 'past'"
          :class="['px-6 py-2 text-sm', activeTab === 'past' ? activeTabClass : inactiveTabClass]">
          過去の試合
        </button>
             
      </div>

            <div>
                <h2 class="text-xl font-semibold text-gray-700 mb-6">
                    {{ activeTab === 'future' ? '今後の試合' : '過去の試合' }}
                </h2>

                <div class="space-y-4">
                    <template v-if="currentMatches.length">
                        <div v-for="match in currentMatches" :key="match.id"
                            class="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-shadow">
                            <!-- チームロゴ -->
                            <div class="flex-shrink-0">
                                <div class="w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-600 rounded-lg overflow-hidden flex items-center justify-center shadow-md">
                                    <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </div>
                            </div>

                            <!-- 試合情報 -->
                            <div class="flex-grow">
                                <div class="flex items-baseline gap-2 mb-1">
                                    <span class="text-sm font-medium text-gray-500">対戦相手</span>
                                    <h3 class="text-lg font-bold text-gray-900">{{ match.opponent_team }}</h3>
                                </div>
                                <div class="text-sm text-gray-600 mb-2">
                                    {{ formatMatchDateTime(match) }}
                                </div>
                                <div v-if="match.location" class="text-sm text-gray-500">
                                    📍 {{ match.location }}
                                </div>
                                <div v-if="match.notes" class="text-sm text-gray-500 italic mt-1">
                                    {{ match.notes }}
                                </div>
                            </div>

                            <!-- アクションボタン -->
                            <div class="flex-shrink-0">
                                <button v-if="isPlayer"
                                    class="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                    {{ activeTab === 'future' ? '出欠席の回答' : '試合結果を見る' }}
                                </button>
                                <div v-else-if="isManager" class="flex gap-2">
                                    <button v-if="activeTab === 'future'"
                                        class="px-4 py-2 text-sm font-medium text-green-600 border-2 border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        出欠状況を確認
                                    </button>
                                    <button v-else
                                        class="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        試合結果を入力
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="p-8 text-center bg-gray-50 rounded-lg">
                            <p class="text-gray-600">
                                {{ activeTab === 'future' ? '今後の試合の予定はありません。' : '過去の試合情報はありません。' }}
                            </p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>