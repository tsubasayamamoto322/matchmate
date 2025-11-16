<script setup lang="ts">
import { ref, computed } from 'vue';

// ===================================
// 1. データ構造 (Gamesテーブルに基づく)
// ===================================

interface Match {
  id: string; 
  team_id: string;
  game_date: string; // 例: '2025-11-23'
  game_time: string; // 例: '13:00:00'
  opponent_team: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// 📌 修正ポイント: 実際のDBのデータ（1試合分）を未来の試合として設定
const providedMatch: Match = {
    id: 'fa8d2f6-e5c9-4ace-a0b9-f7f6c6fdf65',
    team_id: 'dummy-team-id', // データベースに依存しないためダミー
    game_date: '2025-11-23',
    game_time: '13:00:00',
    opponent_team: 'globenet',
    location: null, // 画像に従い NULL
    notes: null,    // 画像に従い NULL
    created_at: '2025-11-09T00:00:00Z', // ダミー
    updated_at: '2025-11-09T00:00:00Z', // ダミー
};

// 今後の試合リストを、このデータのみで構成します。
const futureMatches: Match[] = [providedMatch];
const pastMatches: Match[] = []; // 過去の試合は空のまま

// ===================================
// 2. ロジック (タブ切り替えと日時整形)
// ===================================

const activeTab = ref<'future' | 'past'>('future');
const activeTabClass = 'bg-white border-b-2 border-blue-500 font-semibold text-gray-800';
const inactiveTabClass = 'text-gray-500 hover:text-gray-700 transition duration-150';

const currentMatches = computed(() => {
  return activeTab.value === 'future' ? futureMatches : pastMatches;
});

/**
 * MatchListItemの機能を内部関数として定義し、日時を整形
 */
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
    // 13:00:00 は 午後1時00分になります
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; 

    return `${datePart} ${ampm}${formattedHour}時${minute.toString().padStart(2, '0')}分`;
  } catch (e) {
    return `${match.game_date} ${match.game_time}`;
  }
};
</script>

<template>
  <div class="bg-gray-50 flex-1" style="background-color: #f0f8f7;">
    
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
        <div class="text-xl font-bold text-gray-800">MatchMate</div>
        <nav class="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" class="text-gray-600 hover:text-gray-900">ホーム</a>
          <a href="#" class="text-gray-900 font-bold border-b-2 border-current pb-1">スケジュール</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">テーマ</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">メンバー</a>
        </nav>
        <div class="flex items-center space-x-4">
          <button class="text-gray-600 hover:text-gray-900"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg></button>
          <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            </div>
        </div>
      </div>
    </header>

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
                class="ml-4 px-3 py-1 text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-full hover:bg-blue-100 transition duration-150"
              >
                {{ activeTab === 'future' ? '出欠席の回答' : '試合結果を見る' }}
              </button>
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