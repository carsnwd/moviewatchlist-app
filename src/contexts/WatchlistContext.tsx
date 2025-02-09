import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WatchlistAPIService } from "@/services/WatchlistAPIService/WatchlistAPIService";
import { Watchlist } from "@/services/WatchlistAPIService/models/Watchlist";
import { useAuth } from "@/contexts/AuthContext";

interface WatchlistContextType {
    watchlist: Watchlist;
    loading: boolean;
    error: string | null;
    refetchWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children, watchlistAPIService = WatchlistAPIService.getInstance() }: { children: ReactNode, watchlistAPIService?: WatchlistAPIService }) {
    const [watchlist, setWatchlist] = useState<Watchlist>({ movies: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { authInitialized, user } = useAuth();

    const fetchWatchlist = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await watchlistAPIService.getWatchlist();
            setWatchlist(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authInitialized && user) {
            fetchWatchlist();
        } else if (authInitialized) {
            setLoading(false);
        }
    }, [authInitialized, user, watchlistAPIService]);

    return (
        <WatchlistContext.Provider value={{ watchlist, loading, error, refetchWatchlist: fetchWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error("useWatchlist must be used within a WatchlistProvider");
    }
    return context;
}