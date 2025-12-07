<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { ref, computed, onMounted, watch } from 'vue';

// 監督専用ページ
definePageMeta({
    middleware: 'manager-only'
})

// ロール情報を取得
const { role, isPlayer, isManager, fetchUserRole } = useUserRole()
const route = useRoute()
const config = useRuntimeConfig();
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey);


// -----------------------------------------------------
// 2. フォームデータの定義
// -----------------------------------------------------
const opponentTeam = ref('');
const date = ref('');
const time = ref('');
const location = ref('');
const comment = ref('');

const isLoading = ref(false); // ローディング状態
const errorMsg = ref<string | null>(null);    // エラーメッセージ

// インターフェース定義
interface Game {
    opponent_team: string
    game_date: string
    game_time: string
    location: string
    notes: string
    team_id: string
}

interface AttendanceInsert {
    game_id: string | number
    player_id: string 
    status: string 
}
// -----------------------------------------------------
// 3. 試合登録 (Supabase INSERT) メソッド
// -----------------------------------------------------
const { getTeamId } = useTeamSession()
const router = useRouter()

const registerGame = async () => {
    if (isLoading.value) return;
    console.log("1. registerGame function started.");
    if (!opponentTeam.value || !date.value || !time.value || !location.value) {
        alert('必須項目が入力されていません。');
        return;
    }
    isLoading.value = true;
    errorMsg.value = null;

    // team_idをセッションから取得
    const team_id = await getTeamId()
    if (!team_id) {
        errorMsg.value = 'チームが選択されていません。チーム選択画面に戻ってください。';
        isLoading.value = false;
        return;
    }

    console.log("teamId:", team_id)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
        errorMsg.value = 'ユーザーの認証に失敗しました。ログインし直してください。';
        isLoading.value = false;
        return;
    }
    console.log("ログインユーザー：", authUser.id)
    // データベースに挿入するデータオブジェクトを作成
    const insertData: Game = {
        opponent_team: opponentTeam.value,
        game_date: date.value,
        game_time: time.value,
        location: location.value,
        notes: comment.value,
        team_id: team_id
    };

    try {
        const { data: insertedGame, error: gameError } = await supabase
            .from('games')
            .insert([insertData])
            .select('id')
            .single() as PostgrestSingleResponse<{ id: number }>;

        if (gameError) {
            console.error('試合登録 (games) エラー:', gameError);
            throw gameError;
        }

        // 成功時の処理
        const game_id = insertedGame.id;
        console.log('試合登録成功(game_id):', game_id);

        // team_membersテーブルから、該当チームの全メンバーのplayer_idを取得
        const { data: playersData, error: playersError } = await supabase
            .from('team_members')
            .select('player_id')
            .eq('team_id', team_id)

        if (playersError) {
            console.error('Error fetching team members:', playersError)
            errorMsg.value = 'チームメンバーの取得に失敗しました'
            return
        }

        if (!playersData || !Array.isArray(playersData) || playersData.length === 0) {
            console.warn('No team members found')
            errorMsg.value = 'チームメンバーがいません'
            return
        }

        const attendanceInserts: AttendanceInsert[] = playersData.map(player => ({
            game_id: game_id as string | number,
            player_id: player.player_id,
            status: (player.player_id === authUser.id) ? 'participate' : 'unanswered'
        }));

        const { error: attendanceError } = await supabase
                .from('attendances')
                .insert(attendanceInserts);

        alert('試合が正常に登録されました！メンバーに出欠回答依頼を送信しました。');
        // チームトップページに戻る
        await router.push('/team_top');

    } catch (err: unknown) {
        console.error('試合登録エラー:', err);
        errorMsg.value = `登録に失敗しました: ${err instanceof Error ? err.message : '不明なエラーが発生しました'}`;
    } finally {
        isLoading.value = false;
    }
};


</script>

<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-8 flex items-center justify-center">
            <div class="w-full max-w-2xl">
                <!-- ヘッダー -->
                <div class="mb-6">
                    <NuxtLink to="/team_top"
                        class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        チームトップに戻る
                    </NuxtLink>
                    <h1 class="text-3xl font-bold text-gray-900">試合を作成</h1>
                    <p class="text-gray-700 mt-2">試合情報を入力してください</p>
                </div>

                <!-- フォーム -->
                <div class="bg-white rounded-xl shadow-xl p-8">
                    <form @submit.prevent="registerGame" class="space-y-6">
                        <!-- 対戦相手 -->
                        <div>
                            <label for="opponentTeam" class="block text-sm font-medium text-gray-700 mb-2">
                                対戦相手 <span class="text-red-500">*</span>
                            </label>
                            <input id="opponentTeam" type="text" v-model="opponentTeam" placeholder="対戦相手のチーム名"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required />
                        </div>

                        <!-- 日付 -->
                        <div>
                            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                                日付 <span class="text-red-500">*</span>
                            </label>
                            <input id="date" type="date" v-model="date"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required />
                        </div>

                        <!-- 時間 -->
                        <div>
                            <label for="time" class="block text-sm font-medium text-gray-700 mb-2">
                                時間 <span class="text-red-500">*</span>
                            </label>
                            <input id="time" type="time" v-model="time"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required />
                        </div>

                        <!-- 場所 -->
                        <div>
                            <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                                場所 <span class="text-red-500">*</span>
                            </label>
                            <input id="location" v-model="location" placeholder="例: 東京都渋谷区立幡ヶ谷小学校グラウンド"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required />
                        </div>

                        <!-- コメント -->
                        <div>
                            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                                コメント
                            </label>
                            <textarea id="comment" v-model="comment" placeholder="試合に関する備考やコメント"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                rows="4" />
                        </div>

                        <!-- エラーメッセージ -->
                        <div v-if="errorMsg" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                            {{ errorMsg }}
                        </div>

                        <!-- ボタン -->
                        <div class="flex gap-3 pt-4">
                            <NuxtLink to="/team_top"
                                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                キャンセル
                            </NuxtLink>
                            <button type="submit" :disabled="isLoading || !opponentTeam || !date || !time || !location"
                                class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isLoading ? '登録中...' : '試合を登録' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>
