import AppShell from "@/components/AppShell/AppShell";
import MoviesTable from "@/components/MoviesTable/MoviesTable";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/firebaseConfig";
import { Watchlist } from "@/services/WatchlistAPIService/models/Watchlist";
import { WatchlistAPIService } from "@/services/WatchlistAPIService/WatchlistAPIService";
import { LoadingOverlay } from "@mantine/core";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function HomePage(props: { watchlistAPIService?: WatchlistAPIService }) {
  const { watchlistAPIService = WatchlistAPIService.getInstance() } = props;
  const [watchlist, setWatchlist] = useState<Watchlist>({ movies: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authInitialized, user } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        try {
          const data = await watchlistAPIService.getWatchlist();
          setWatchlist(data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [authInitialized, user, watchlistAPIService]);

  if (!authInitialized || loading) {
    return <AppShell><LoadingOverlay /></AppShell>;
  }

  if (error) {
    return <AppShell>Error: {error}</AppShell>;
  }

  return (
    <AppShell>
      <MoviesTable {...watchlist} />
    </AppShell>
  );
}