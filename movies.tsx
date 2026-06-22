import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/lib/tmdb";
import { HeroBanner } from "@/components/HeroBanner";
import { MediaRow } from "@/components/MediaRow";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Movies — Streamr" },
      { name: "description", content: "Browse popular, top-rated and upcoming movies." },
    ],
  }),
  component: MoviesPage,
});

function MoviesPage() {
  const trending = useQuery({ queryKey: ["trendingMovies"], queryFn: () => tmdb.trendingMovies() });
  const popular = useQuery({ queryKey: ["popularMovies"], queryFn: () => tmdb.popularMovies() });
  const top = useQuery({ queryKey: ["topMovies"], queryFn: () => tmdb.topMovies() });
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: () => tmdb.upcomingMovies() });
  const now = useQuery({ queryKey: ["nowPlaying"], queryFn: () => tmdb.nowPlaying() });
  return (
    <div>
      <HeroBanner items={trending.data?.results ?? []} />
      <div className="-mt-16 relative z-10 space-y-2">
        <MediaRow title="Trending Movies" items={trending.data?.results ?? []} forceType="movie" />
        <MediaRow title="Now Playing" items={now.data?.results ?? []} forceType="movie" />
        <MediaRow title="Popular" items={popular.data?.results ?? []} forceType="movie" />
        <MediaRow title="Top Rated" items={top.data?.results ?? []} forceType="movie" />
        <MediaRow title="Coming Soon" items={upcoming.data?.results ?? []} forceType="movie" />
      </div>
    </div>
  );
}
