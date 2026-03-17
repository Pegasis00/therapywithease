import { useEffect, useRef, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSyncUser = () => {
    const { user, isAuthenticated, isLoading: isAuthLoading, getToken } = useKindeAuth();
    const queryClient = useQueryClient();
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncDone, setSyncDone] = useState(false);
    // Prevent double-runs across re-renders in the same session
    const hasSynced = useRef(false);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated || !user?.id) {
            setSyncDone(true);
            return;
        }

        if (hasSynced.current) return;
        hasSynced.current = true;

        const syncUser = async () => {
            setIsSyncing(true);

            const id = user.id;
            const email = user.email ?? '';
            const full_name = `${user.givenName ?? ''} ${user.familyName ?? ''}`.trim();

            const storedRole = localStorage.getItem('user_role') as 'patient' | 'psychiatrist' | 'therapist' | null;
            const roleToUse = storedRole || 'patient';
            
            console.log('[useSyncUser] id:', id, '| storedRole:', storedRole);

            try {
                // Get Kinde Token for Secure Backend Communication
                const token = await getToken();
                
                if (!token) {
                    throw new Error("Failed to get authentication token");
                }

                const response = await fetch('/api/users/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email, full_name, role: roleToUse })
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.message === 'Profile created') {
                     console.log('[useSyncUser] Profile created! role =', roleToUse);
                } else if (data.profile) {
                     console.log('[useSyncUser] Existing profile. role in DB =', data.profile.role);
                     
                     if (storedRole && storedRole !== data.profile.role) {
                        const roleLabels: Record<string, string> = {
                            patient: 'Patient',
                            psychiatrist: 'Psychiatrist',
                            therapist: 'Therapist',
                        };
                        toast.warning(
                            `⚠️ Your account is registered as a ${roleLabels[data.profile.role]}. Redirecting you to your ${roleLabels[data.profile.role]} dashboard.`,
                            { duration: 6000 }
                        );
                        console.warn(
                            `[useSyncUser] Role mismatch! Tried: ${storedRole}, DB has: ${data.profile.role}`
                        );
                     }
                }

                // Clear stored role and refresh profile query
                localStorage.removeItem('user_role');
                await queryClient.invalidateQueries({ queryKey: ['profile', id] });

            } catch (err) {
                console.error('[useSyncUser] Unexpected error:', err);
                toast.error('Could not sync your profile securely. Please contact support.', { duration: 8000 });
                localStorage.removeItem('user_role');
            } finally {
                setIsSyncing(false);
                setSyncDone(true);
                console.log('[useSyncUser] Sync complete.');
            }
        };

        syncUser();
    }, [isAuthenticated, isAuthLoading, user?.id, user?.email, user?.givenName, user?.familyName, queryClient, getToken]);

    return { isSyncing, syncDone };
};
