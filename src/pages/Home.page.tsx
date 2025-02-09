import { useWatchlist } from "@/contexts/WatchlistContext";
import { LoadingOverlay } from "@mantine/core";
import AppShell from "@/components/AppShell/AppShell";
import MoviesTable from "@/components/MoviesTable/MoviesTable";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { loading, error } = useWatchlist();
  const { authInitialized, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authInitialized && !user) {
      navigate("/auth")
    }
  })

  if (loading) {
    return <AppShell><LoadingOverlay /></AppShell>;
  }

  if (error) {
    return <AppShell>Error: {error}</AppShell>;
  }

  return (
    <AppShell>
      <MoviesTable />
    </AppShell>
  );
}