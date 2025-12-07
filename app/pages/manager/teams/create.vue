<template>
  <div class="flex flex-col flex-1">
    <!-- メインコンテンツ -->
    <main class="flex-1 p-8 flex items-center justify-center">
      <div class="w-full max-w-2xl">
                <!-- ヘッダー -->
                <div class="mb-6">
                    <NuxtLink :to="isEditMode ? '/team_info' : '/team_select'"
                        class="inline-flex items-center text-sm text-white hover:text-gray-100 mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        {{ isEditMode ? 'チーム情報に戻る' : 'チーム選択に戻る' }}
                    </NuxtLink>
                    <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode ? 'チーム情報編集' : '新規チーム作成' }}</h1>
                    <p class="text-gray-700 mt-2">{{ isEditMode ? 'チーム情報を編集してください' : 'チーム情報を入力してください' }}</p>
                </div>

                <!-- フォーム -->
                <div class="bg-white rounded-xl shadow-xl p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- チーム名 -->
                        <div>
                            <label for="teamName" class="block text-sm font-medium text-gray-700 mb-2">
                                チーム名 <span class="text-red-500">*</span>
                            </label>
                            <input id="teamName" v-model="formData.teamName" type="text" required
                                placeholder="例: 東京フットボールクラブ"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                        </div>

                        <!-- チームロゴ -->
                        <div>
                            <label for="teamLogo" class="block text-sm font-medium text-gray-700 mb-2">
                                チームロゴ
                            </label>
                            <div class="flex items-center gap-4">
                                <!-- プレビュー -->
                                <div
                                    class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                    <img v-if="logoPreview" :src="logoPreview" alt="ロゴプレビュー"
                                        class="w-full h-full object-cover" />
                                    <svg v-else class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <!-- ファイル選択 -->
                                <div class="flex-1">
                                    <input id="teamLogo" ref="fileInput" type="file" accept="image/*"
                                        @change="handleFileChange" class="hidden" />
                                    <button type="button" @click="fileInput?.click()"
                                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                        ファイルを選択
                                    </button>
                                    <p class="text-xs text-gray-500 mt-2">
                                        PNG, JPG, GIF (最大5MB)
                                    </p>
                                    <button v-if="logoPreview" type="button" @click="clearLogo"
                                        class="text-xs text-red-600 hover:text-red-700 mt-1">
                                        削除
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 所在地 -->
                        <div>
                            <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                                所在地
                            </label>
                            <input id="location" v-model="formData.location" type="text" placeholder="例: 東京都渋谷区"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                        </div>

                        <!-- エラーメッセージ -->
                        <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                            {{ error }}
                        </div>

                        <!-- ボタン -->
                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="$router.back()"
                                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                キャンセル
                            </button>
                            <button type="submit" :disabled="loading || !formData.teamName"
                                class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ loading ? (isEditMode ? '更新中...' : '作成中...') : (isEditMode ? 'チーム情報を更新' : 'チームを作成') }}
                            </button>
                        </div>
                    </form>
                </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

// 監督専用ページ
definePageMeta({
    middleware: 'manager-only'
})

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
const router = useRouter()
const { getTeamId } = useTeamSession()

// ユーザー情報を取得
const { userData, fetchUserRole } = useUserRole()

// 編集モード判定
const isEditMode = ref(false)
const currentTeamId = ref<string | null>(null)

// フォームデータ
const formData = ref({
    teamName: '',
    location: '',
    logoFile: null as File | null
})

const logoPreview = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const existingLogoUrl = ref<string | null>(null)

// 既存のチームデータを取得（編集モードの場合）
const fetchExistingTeamData = async () => {
    const route = useRoute()
    
    // URLクエリパラメータで編集モードかどうかを判定
    if (route.query.edit === 'true' && currentTeamId.value) {
        isEditMode.value = true
    } else {
        isEditMode.value = false
    }

    if (!isEditMode.value || !currentTeamId.value) return

    try {
        const { data: team, error: fetchError } = await supabase
            .from('teams')
            .select('*')
            .eq('id', currentTeamId.value)
            .single()

        if (fetchError) {
            console.error('Error fetching team:', fetchError)
            error.value = 'チーム情報の取得に失敗しました'
            return
        }

        if (team) {
            // フォームに既存データを設定
            formData.value.teamName = team.team_name || ''
            formData.value.location = team.address || ''
            existingLogoUrl.value = team.team_logo_url
            
            // プレビューに既存のロゴを表示
            if (team.team_logo_url) {
                logoPreview.value = team.team_logo_url
            }
        }
    } catch (err) {
        console.error('Error:', err)
        error.value = 'チーム情報の取得中にエラーが発生しました'
    }
}

// 初期化
onMounted(async () => {
    await fetchUserRole()
    
    // セッションからチームIDを取得（編集モード用）
    const teamIdFromSession = await getTeamId()
    if (teamIdFromSession) {
        currentTeamId.value = teamIdFromSession
        isEditMode.value = true
    }
    
    await fetchExistingTeamData()
})

// ファイル選択処理
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
        error.value = 'ファイルサイズは5MB以下にしてください'
        return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
        error.value = '画像ファイルを選択してください'
        return
    }

    formData.value.logoFile = file

    // プレビュー表示
    const reader = new FileReader()
    reader.onload = (e) => {
        logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    error.value = ''
}

// ロゴクリア
const clearLogo = () => {
    formData.value.logoFile = null
    logoPreview.value = null
    existingLogoUrl.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Supabase URLからファイルパスを抽出
const extractFilePathFromUrl = (url?: string): string | null => {
    try {
        if (!url) return null
        
        // URLの形式: https://xxxxx.supabase.co/storage/v1/object/public/team-logos/team-logos/{team_id}/{fileName}
        if (url.includes('/object/public/team-logos/')) {
            const parts = url.split('/object/public/team-logos/')
            if (parts.length > 1 && parts[1]) {
                return parts[1]
            }
        }
        
        // すでにパスの場合
        if (url.includes('team-logos/')) {
            return url
        }
        
        return null
    } catch (err) {
        console.error('Error extracting file path:', err)
        return null
    }
}

// 旧ロゴを削除
const deleteOldLogo = async (oldLogoUrl: string) => {
    if (!oldLogoUrl) return
    
    try {
        const oldFilePath = extractFilePathFromUrl(oldLogoUrl)
        if (!oldFilePath) {
            console.warn('Could not extract file path from old logo URL:', oldLogoUrl)
            return
        }
        
        await supabase.storage
            .from('team-logos')
            .remove([oldFilePath])
        
        console.log('Old logo deleted successfully:', oldFilePath)
    } catch (err) {
        console.warn('Failed to delete old logo:', err)
        // 旧ロゴ削除エラーは無視して続行
    }
}

// フォーム送信
const handleSubmit = async () => {
    if (!userData.value?.id) {
        error.value = 'ユーザー情報の取得に失敗しました'
        return
    }

    loading.value = true
    error.value = ''

    try {
        let logoUrl = existingLogoUrl.value

        // ロゴアップロード処理（新しいファイルが選択された場合のみ）
        if (formData.value.logoFile) {
            const fileExt = formData.value.logoFile.name.split('.').pop()
            
            // 新規作成時と編集時でチームIDを処理
            let teamIdForPath = currentTeamId.value
            if (!teamIdForPath) {
                // 新規作成時は一時的なIDを使用（後でデータベースに保存後に更新されることを想定）
                teamIdForPath = `temp-${Date.now()}`
            }
            
            const fileName = `team-logos/${teamIdForPath}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('team-logos')
                .upload(fileName, formData.value.logoFile)

            if (uploadError) {
                console.error('Upload error:', uploadError)
                error.value = `ロゴのアップロードに失敗しました: ${uploadError.message}`
                return
            }

            // 公開URLを取得
            const { data: urlData } = supabase.storage
                .from('team-logos')
                .getPublicUrl(fileName)

            logoUrl = urlData.publicUrl

            // 旧ロゴがあれば削除
            if (isEditMode.value && existingLogoUrl.value) {
                await deleteOldLogo(existingLogoUrl.value)
            }
        }

        if (isEditMode.value) {
            // 編集モード：既存チームを更新
            const { error: updateError } = await supabase
                .from('teams')
                .update({
                    team_name: formData.value.teamName,
                    address: formData.value.location || null,
                    team_logo_url: logoUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentTeamId.value)

            if (updateError) {
                console.error('Update error:', updateError)
                error.value = 'チーム情報の更新に失敗しました'
                return
            }

            // 成功：チーム情報画面に戻る
            await router.push('/team_info')
        } else {
            // 新規作成モード
            let finalLogoUrl = logoUrl
            
            // ロゴがアップロードされた場合、テンポラリーIDから本来のIDへ移動
            if (formData.value.logoFile && logoUrl && logoUrl.includes('temp-')) {
                // 一旦チーム作成
                const { data: teamData, error: insertError } = await supabase
                    .from('teams')
                    .insert({
                        team_name: formData.value.teamName,
                        address: formData.value.location || null,
                        team_logo_url: logoUrl, // テンポラリーURLで一旦保存
                        manager_id: userData.value.id,
                    })
                    .select()
                    .single()

                if (insertError) {
                    console.error('Insert error:', insertError)
                    error.value = 'チームの作成に失敗しました'
                    return
                }

                // 新しいteam_idでロゴファイルを移動
                if (teamData?.id) {
                    try {
                        const oldFilePath = extractFilePathFromUrl(logoUrl)
                        if (oldFilePath) {
                            // 古いファイルを削除
                            await supabase.storage
                                .from('team-logos')
                                .remove([oldFilePath])
                        }

                        // 新しいパスでファイルを再度アップロード
                        const fileExt = formData.value.logoFile.name.split('.').pop()
                        const newFileName = `team-logos/${teamData.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

                        const { error: reuploadError } = await supabase.storage
                            .from('team-logos')
                            .upload(newFileName, formData.value.logoFile)

                        if (!reuploadError) {
                            const { data: newUrlData } = supabase.storage
                                .from('team-logos')
                                .getPublicUrl(newFileName)

                            finalLogoUrl = newUrlData.publicUrl

                            // チーム情報を更新
                            await supabase
                                .from('teams')
                                .update({ team_logo_url: finalLogoUrl })
                                .eq('id', teamData.id)
                        }
                    } catch (err) {
                        console.warn('Error moving logo file:', err)
                        // ロゴ移動エラーは無視して続行
                    }
                }
            } else {
                // ロゴなし、または正常なパスでのアップロード
                const { data: teamData, error: insertError } = await supabase
                    .from('teams')
                    .insert({
                        team_name: formData.value.teamName,
                        address: formData.value.location || null,
                        team_logo_url: logoUrl,
                        manager_id: userData.value.id,
                    })
                    .select()
                    .single()

                if (insertError) {
                    console.error('Insert error:', insertError)
                    error.value = 'チームの作成に失敗しました'
                    return
                }
            }

            // 成功：チーム選択画面に戻る
            await router.push('/team_select')
        }
    } catch (err) {
        console.error('Error:', err)
        error.value = isEditMode.value ? 'チーム情報の更新中にエラーが発生しました' : 'チームの作成中にエラーが発生しました'
    } finally {
        loading.value = false
    }
}

useHead({
    title: computed(() => isEditMode.value ? 'MatchMate - チーム編集' : 'MatchMate - チーム作成'),
    meta: [
        { name: 'description', content: computed(() => isEditMode.value ? 'チーム情報を編集' : '新しいチームを作成') }
    ]
})
</script>
