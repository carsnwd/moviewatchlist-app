import { useWatchlist } from "@/contexts/WatchlistContext";
import { LoadingOverlay, Button, Group } from "@mantine/core";
import AppShell from "@/components/AppShell/AppShell";
import MoviesTable from "@/components/MoviesTable/MoviesTable";

export function HomePage() {
  const { loading, error, refetchWatchlist } = useWatchlist();

  if (loading) {
    return <AppShell><LoadingOverlay /></AppShell>;
  }

  if (error) {
    return <AppShell>Error: {error}</AppShell>;
  }

  return (
    <AppShell>
      <Group mb="md">
        <Button onClick={refetchWatchlist}>Refresh</Button>
      </Group>
      <MoviesTable />
    </AppShell>
  );
}