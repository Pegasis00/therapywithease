import { useQuery } from "@tanstack/react-query";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useSyncContext } from "@/context/SyncContext";

export const useProfile = () => {
    const { user, isAuthenticated, isLoading: isAuthLoading, getToken } = useKindeAuth();
    // Wait for useSyncUser to complete before fetching the profile.
    // This prevents the race condition where useProfile returns 404 before
    // the user row has been written to the database by useSyncUser.
    const { syncDone } = useSyncContext();

    return useQuery({
        queryKey: ["profile", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;

            console.log('[useProfile] Fetching profile for:', user.id);

            const token = await getToken();
            if (!token) throw new Error("No token");

            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[useProfile] Error fetching profile:', errorData);
                throw new Error(errorData.error || 'Failed to fetch profile');
            }

            const data = await response.json();
            console.log('[useProfile] Got profile:', data);
            return data ?? null;
        },
        // Only fetch after:
        // 1. Auth is resolved
        // 2. User is authenticated
        // 3. We have a user ID
        // 4. Sync has completed (user row guaranteed to exist in DB)
        enabled: !isAuthLoading && isAuthenticated && !!user?.id && syncDone,
        // Retry so we pick up the profile right after sync creates it
        retry: 3,
        retryDelay: 800,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
