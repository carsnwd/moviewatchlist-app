import AppShell from "@/components/AppShell/AppShell";
import { auth } from "@/firebaseConfig";
import { WatchlistAPIService } from "@/services/WatchlistAPIService/WatchlistAPIService";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function HomePage(props: { watchlistAPIService: WatchlistAPIService }) {
  const { watchlistAPIService = WatchlistAPIService.getInstance() } = props;
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthInitialized(true);
      if (user) {
        try {
          const data = await watchlistAPIService.getWatchlist();
          setWatchlist(data.movies);
        } catch (error: any) {
          setError(error.message);
        } finally {
          console.log(watchlist)
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [watchlistAPIService]);

  if (!authInitialized) {
    return <AppShell>Initializing...</AppShell>;
  }

  if (loading) {
    return <AppShell>Loading...</AppShell>;
  }

  if (error) {
    return <AppShell>Error: {error}</AppShell>;
  }

  return (
    <AppShell>
      {watchlist.map((movie) => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </AppShell>
  );
}