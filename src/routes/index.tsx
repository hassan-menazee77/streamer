import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/lib/tmdb";
import { HeroBanner } from "@/components/HeroBanner";
import { MediaRow } from "@/components/MediaRow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Streamr — Trending movies & TV shows" },
      { name: "description", content: "Discover trending, popular, and top-rated movies and TV shows. Stream instantly." },
    ],
  }),
  component: Index,
});

function Index() {
  const trending = useQuery({ queryKey: ["trending"], queryFn: () => tmdb.trending("week") });
  const popularMovies = useQuery({ queryKey: ["popularMovies"], queryFn: () => tmdb.popularMovies() });
  const topMovies = useQuery({ queryKey: ["topMovies"], queryFn: () => tmdb.topMovies() });
  const popularTv = useQuery({ queryKey: ["popularTv"], queryFn: () => tmdb.popularTv() });
  const onAir = useQuery({ queryKey: ["onAir"], queryFn: () => tmdb.onTheAir() });
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: () => tmdb.upcomingMovies() });

  return (
    <div>
      <HeroBanner items={trending.data?.results ?? []} />
      <div className="-mt-16 relative z-10 space-y-2">
        <MediaRow title="Trending Now" items={trending.data?.results ?? []} />
        <MediaRow title="Popular Movies" items={popularMovies.data?.results ?? []} forceType="movie" />
        <MediaRow title="Popular TV Shows" items={popularTv.data?.results ?? []} forceType="tv" />
        <MediaRow title="Top Rated Movies" items={topMovies.data?.results ?? []} forceType="movie" />
        <MediaRow title="On The Air" items={onAir.data?.results ?? []} forceType="tv" />
        <MediaRow title="Coming Soon" items={upcoming.data?.results ?? []} forceType="movie" />
      </div>
    </div>
  );
}
