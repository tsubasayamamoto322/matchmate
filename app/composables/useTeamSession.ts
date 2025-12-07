import { createClient } from "@supabase/supabase-js";
import { ref } from "vue";

export const useTeamSession = () => {
    const config = useRuntimeConfig();
    const supabase = createClient(
        config.public.supabaseUrl,
        config.public.supabaseKey
    );

    // インスタンスごとに独立した状態を保持
    const sessionTeamId = ref<string | null>(null);
    let isInitialized = false;

    /**
     * セッションからチームIDを取得
     */
    const getTeamId = async (): Promise<string | null> => {
        if (isInitialized && sessionTeamId.value) {
            return sessionTeamId.value;
        }

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            
            if (!user) {
                console.debug("No authenticated user found");
                return null;
            }

            if (user?.user_metadata?.data?.teamId) {
                sessionTeamId.value = user.user_metadata.data.teamId;
                isInitialized = true;
                return sessionTeamId.value;
            } else {
                console.debug("Team ID not found in user metadata", {
                    userMetadata: user?.user_metadata,
                });
            }
        } catch (err) {
            console.error("Error getting team session:", err);
        }

        return null;
    };

    /**
     * セッションにチームIDを設定
     */
    const setTeamId = async (teamId: string) => {
        try {
            const { data: { user }, error: getUserError } = await supabase.auth.getUser();
            
            if (!user || getUserError) {
                console.error("Error getting current user:", getUserError);
                return false;
            }

            // 既存のメタデータを取得して、チームIDを追加
            const currentMetadata = user.user_metadata || {};
            const updatedMetadata = {
                ...currentMetadata,
                data: {
                    ...(currentMetadata.data || {}),
                    teamId: teamId,
                },
            };

            const { error: updateError } = await supabase.auth.updateUser({
                data: updatedMetadata,
            });

            if (updateError) {
                console.error("Error updating user metadata:", updateError);
                return false;
            }

            sessionTeamId.value = teamId;
            isInitialized = true;
            console.log("Team ID set successfully:", teamId);
            return true;
        } catch (err) {
            console.error("Error setting team session:", err);
            return false;
        }
    };

    /**
     * セッションをクリア
     */
    const clearTeamId = () => {
        sessionTeamId.value = null;
        isInitialized = false;
    };

    return {
        sessionTeamId,
        getTeamId,
        setTeamId,
        clearTeamId,
    };
};
