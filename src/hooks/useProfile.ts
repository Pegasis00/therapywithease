import { useQuery } from "@tanstack/react-query";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const useProfile = () => {
    const { user, isAuthenticated, isLoading: isAuthLoading, getToken } = useKindeAuth();

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
                const errorData = await response.json();
                console.error('[useProfile] Error fetching profile:', errorData);
                throw new Error(errorData.error || 'Failed to fetch profile');
            }

            const data = await response.json();

            console.log('[useProfile] Got profile:', data);
            return data ?? null;
        },
        enabled: !isAuthLoading && isAuthenticated && !!user?.id,
        // Retry quickly so fresh data is picked up after useSyncUser creates the profile
        retry: 3,
        retryDelay: 500,
    });
};
