<template>
    <div class="flex flex-col flex-1">
        <!-- メインコンテンツ -->
        <main class="flex-1 p-8">
            <div class="max-w-4xl mx-auto">
                <!-- ヘッダー -->
                <div class="mb-6">
                    <NuxtLink to="/team_top"
                        class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        チームトップに戻る
                    </NuxtLink>
                </div>

                <!-- 表示モード -->
                <div v-if="!isEditing && userData" class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div class="flex items-start justify-between gap-8">
                        <div class="flex items-start gap-8 flex-grow">
                            <!-- アバター -->
                            <div class="flex-shrink-0">
                                <div class="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center shadow-lg">
                                    <img v-if="userData.avatar_url" :src="userData.avatar_url" :alt="userData.user_name"
                                        class="w-full h-full object-cover" />
                                    <div v-else class="text-5xl text-white font-bold">
                                        {{ userData.user_name?.charAt(0) || '？' }}
                                    </div>
                                </div>
                            </div>

                            <!-- ユーザー情報 -->
                            <div class="flex-grow">
                                <div class="mb-6">
                                    <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ userData.user_name }}</h1>
                                    <p class="text-gray-600">{{ roleText }}</p>
                                </div>

                                <div class="space-y-4">
                                    <!-- メールアドレス -->
                                    <div>
                                        <p class="text-sm font-medium text-gray-500 mb-1">メールアドレス</p>
                                        <p class="text-gray-900">{{ userData.email || '-' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 編集ボタン -->
                        <button @click="startEdit"
                            class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2 flex-shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            編集
                        </button>
                    </div>
                </div>

                <!-- 編集モード -->
                <div v-if="isEditing && userData" class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">プロフィール編集</h2>

                    <form @submit.prevent="saveProfile" class="space-y-6">
                        <!-- アバター編集 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-4">プロフィール画像</label>
                            <div class="flex items-end gap-6">
                                <div class="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <img v-if="editFormData.avatar_url" :src="editFormData.avatar_url" alt="プロフィール画像"
                                        class="w-full h-full object-cover" />
                                    <div v-else class="text-5xl text-white font-bold">
                                        {{ editFormData.user_name?.charAt(0) || '？' }}
                                    </div>
                                </div>
                                <div class="flex-grow">
                                    <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange"
                                        class="hidden" />
                                    <button type="button" @click="fileInput?.click()"
                                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                        ファイルを選択
                                    </button>
                                    <p class="text-xs text-gray-500 mt-2">PNG, JPG, GIF (最大5MB)</p>
                                    <button v-if="editFormData.avatar_url && editFormData.avatar_url !== userData.avatar_url" type="button" @click="clearAvatar"
                                        class="text-xs text-red-600 hover:text-red-700 mt-2">
                                        削除
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ユーザー名 -->
                        <div>
                            <label for="userName" class="block text-sm font-medium text-gray-700 mb-2">
                                ユーザー名 <span class="text-red-500">*</span>
                            </label>
                            <input id="userName" v-model="editFormData.user_name" type="text" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                        </div>

                        <!-- メールアドレス -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                メールアドレス <span class="text-red-500">*</span>
                            </label>
                            <input id="email" v-model="editFormData.email" type="email" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                        </div>

                        <!-- エラーメッセージ -->
                        <div v-if="editError" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                            {{ editError }}
                        </div>

                        <!-- ボタン -->
                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="cancelEdit"
                                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                キャンセル
                            </button>
                            <button type="submit" :disabled="isSaving || !editFormData.user_name || !editFormData.email"
                                class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isSaving ? '保存中...' : '保存' }}
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

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
const { isManager, isPlayer } = useUserRole()
const { getTeamId } = useTeamSession()

// データ
const userData = ref<any>(null)
const isEditing = ref(false)
const isSaving = ref(false)
const editError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 編集フォームデータ
const editFormData = ref({
    user_name: '',
    email: '',
    avatar_url: null as string | null,
    avatar_file: null as File | null
})

// ロール表示テキスト
const roleText = computed(() => {
    if (isManager.value) return '監督'
    if (isPlayer.value) return '選手'
    return 'ユーザー'
})

// ユーザー情報を取得
const fetchUserData = async () => {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return

        const { data, error } = await supabase
            .from('users')
            .select('id, user_name, email, avatar_url')
            .eq('id', authUser.id)
            .single()

        if (error) {
            console.error('Error fetching user data:', error)
            return
        }

        userData.value = data
    } catch (err) {
        console.error('Error:', err)
    }
}


// 編集開始
const startEdit = () => {
    if (userData.value) {
        editFormData.value = {
            user_name: userData.value.user_name,
            email: userData.value.email,
            avatar_url: userData.value.avatar_url,
            avatar_file: null
        }
        isEditing.value = true
        editError.value = null
    }
}

// 編集キャンセル
const cancelEdit = () => {
    isEditing.value = false
    editError.value = null
    editFormData.value.avatar_file = null
}

// ファイル選択処理
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
        editError.value = 'ファイルサイズは5MB以下にしてください'
        return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
        editError.value = '画像ファイルを選択してください'
        return
    }

    editFormData.value.avatar_file = file

    // プレビュー表示
    const reader = new FileReader()
    reader.onload = (e) => {
        editFormData.value.avatar_url = e.target?.result as string
    }
    reader.readAsDataURL(file)

    editError.value = ''
}

// アバタークリア
const clearAvatar = () => {
    editFormData.value.avatar_file = null
    editFormData.value.avatar_url = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// プロフィール保存
const saveProfile = async () => {
    if (isSaving.value) return
    isSaving.value = true
    editError.value = null

    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
            editError.value = 'ユーザー認証エラー'
            return
        }

        let avatarUrl = editFormData.value.avatar_url

        // アバターがアップロードされた場合
        // 注：team-logos バケットは概念的にはロゴとアバター両方を格納する共通ストレージとして機能
        // パス: team-logos/avatars/{user_id}/{timestamp}.{ext}
        if (editFormData.value.avatar_file) {
            const fileExt = editFormData.value.avatar_file.name.split('.').pop()
            const fileName = `avatars/${authUser.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('team-logos')
                .upload(fileName, editFormData.value.avatar_file)

            if (uploadError) {
                console.error('Upload error:', uploadError)
                editError.value = `アバターのアップロードに失敗しました: ${uploadError.message}`
                return
            }

            // 公開URLを取得
            const { data: urlData } = supabase.storage
                .from('team-logos')
                .getPublicUrl(fileName)

            avatarUrl = urlData.publicUrl

            // 古いアバターを削除
            if (userData.value.avatar_url) {
                try {
                    const oldFileName = extractFilePathFromUrl(userData.value.avatar_url)
                    if (oldFileName) {
                        await supabase.storage
                            .from('team-logos')
                            .remove([oldFileName])
                        console.log('Old avatar deleted:', oldFileName)
                    }
                } catch (err) {
                    console.warn('Failed to delete old avatar:', err)
                    // 古いファイル削除エラーは無視して続行
                }
            }
        }

        // 1. メールアドレスが変更されている場合、Supabase認証情報を更新
        if (editFormData.value.email !== userData.value.email) {
            try {
                const { data: authData, error: emailError } = await supabase.auth.updateUser({
                    email: editFormData.value.email
                })

                if (emailError) {
                    console.error('Email update error:', emailError)
                    editError.value = `メールアドレスの更新に失敗しました: ${emailError.message}`
                    return
                }

                console.log('Auth email updated:', authData)

                // メールアドレス変更時のユーザーへの通知
                alert('メールアドレスが変更されました。\n確認メールが新しいメールアドレスに送信されています。\n確認後、新しいメールアドレスで再度ログインしてください。')
            } catch (err) {
                console.error('Email update exception:', err)
                editError.value = 'メールアドレスの更新に失敗しました'
                return
            }
        }

        // 2. usersテーブルを更新
        // 注：メール変更時はAuthenticationの確認メール後に自動更新される
        // ここでは最新のAuthenticationメールアドレスを取得して使用
        const { data: { user: updatedAuthUser } } = await supabase.auth.getUser()
        const latestEmail = updatedAuthUser?.email || editFormData.value.email

        const { error: updateError } = await supabase
            .from('users')
            .update({
                user_name: editFormData.value.user_name,
                email: latestEmail,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', authUser.id)

        if (updateError) {
            console.error('Update error:', updateError)
            editError.value = 'プロフィールの更新に失敗しました'
            return
        }

        // 成功：データ再取得
        await fetchUserData()
        isEditing.value = false
        alert('プロフィールが正常に更新されました！')
    } catch (err: unknown) {
        console.error('Error:', err)
        editError.value = `エラーが発生しました: ${err instanceof Error ? err.message : '不明なエラー'}`
    } finally {
        isSaving.value = false
    }
}

// ページ読み込み時に実行
onMounted(async () => {
    await fetchUserData()
})

// Supabase URLからファイルパスを抽出
const extractFilePathFromUrl = (url?: string): string | null => {
    try {
        // URLの形式: https://xxxxx.supabase.co/storage/v1/object/public/team-logos/avatars/user-id/timestamp-hash.ext
        // または、直接パスが渡される場合もある
        
        if (!url) return null
        
        // URLの場合
        if (url.includes('/object/public/team-logos/')) {
            const parts = url.split('/object/public/team-logos/')
            if (parts.length > 1 && parts[1]) {
                return parts[1]
            }
        }
        
        // すでにパスの場合
        if (url.includes('avatars/')) {
            return url
        }
        
        return null
    } catch (err) {
        console.error('Error extracting file path:', err)
        return null
    }
}

useHead({
    title: 'MatchMate - プロフィール',
    meta: [
        { name: 'description', content: 'プロフィール' }
    ]
})
</script>
