import { createContext, useContext } from "react";

export interface SyncState {
    isSyncing: boolean;
    syncDone: boolean;
}

export const SyncContext = createContext<SyncState>({
    isSyncing: false,
    syncDone: false,
});

export const useSyncContext = () => useContext(SyncContext);
