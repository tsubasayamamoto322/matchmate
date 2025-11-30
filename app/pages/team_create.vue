<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { ref, computed, onMounted, watch } from 'vue';

// ロール情報を取得
const { role, isPlayer, isManager, fetchUserRole } = useUserRole()
const route = useRoute()
const config = useRuntimeConfig();
const supabase = useSupabaseClient();


// -----------------------------------------------------
// 2. フォームデータの定義
// -----------------------------------------------------
//const title = ref('');
const date = ref('');
const time = ref('');
const location = ref('');
const comment = ref('');

const isLoading = ref(false); // ローディング状態
const errorMsg = ref(null);    // エラーメッセージ

// -----------------------------------------------------
// 3. 試合登録 (Supabase INSERT) メソッド
// -----------------------------------------------------
const registerGame = async () => {
  if (isLoading.value) return;
  console.log("1. registerGame function started.");
  if (!date.value || !time.value || !location.value) {
        alert('必須項目が入力されていません。');
        return;
    }
  isLoading.value = true;
  errorMsg.value = null;

  // team_idを取得（URLクエリまたはセッションから）
  const team_id = route.query.team_id as string
  console.log("teamId:",team_id)
  const { data: { user: authUser } } = await supabase.auth.getUser()
  console.log("ログインユーザー：",authUser.id)
  // データベースに挿入するデータオブジェクトを作成
  const insertData = {
    game_date: date.value,
    game_time: time.value,
    location: location.value,
    notes: comment.value,
    team_id: team_id
  };

  try {
    const { data, error } = await supabase
      .from('games') 
      .insert([insertData])

    if (error) {
      throw error;
    }

    // 成功時の処理
    console.log('試合登録成功:', data);
    alert('試合が正常に登録されました！');
    // フォームをクリアするか、別のページにリダイレクトする処理
    // router.push('/success-page'); 

  } catch (err) {
    console.error('試合登録エラー:', err);
    errorMsg.value = `登録に失敗しました: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-8">
    <div class="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <h2 class="text-2xl font-bold mb-6">試合を依頼</h2>

      <section class="mb-8">
        <h3 class="font-bold text-lg mb-4 text-gray-800">試合情報</h3>
        <div class="space-y-4">

          <h4 class="font-bold text-mid mb-4 text-gray-800">日付</h4>
          <input 
            type="date"
            v-model="date"
            placeholder="Value"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          <h4 class="font-bold text-mid mb-4 text-gray-800">時間</h4>
          <input 
            type="time"
            v-model="time"
            placeholder="Value"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          <h4 class="font-bold text-mid mb-4 text-gray-800">場所</h4>
          <input 
            v-model="location"
            placeholder="場所"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          <h4 class="font-bold text-mid mb-4 text-gray-800">コメント</h4>
          <textarea 
            v-model="comment"
            placeholder="コメント"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </section>
      <div class="flex justify-end">
        <button 
          @click="registerGame" 
          class="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition-colors"
        >
          試合を登録
        </button>
      </div>
    </div>
  </div>
</template>

