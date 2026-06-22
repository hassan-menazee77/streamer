import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/lib/tmdb";
import { HeroBanner } from "@/components/HeroBanner";
import { MediaRow } from "@/components/MediaRow";

export const Route = createFileRoute("/tv")({
  head: () => ({
    meta: [
      { title: "TV Shows — Streamr" },
      { name: "description", content: "Browse popular and top-rated TV series." },
    ],
  }),
  component: TvPage,
});

function TvPage() {
  const trending = useQuery({ queryKey: ["trendingTv"], queryFn: () => tmdb.trendingTv() });
  const popular = useQuery({ queryKey: ["popularTv"], queryFn: () => tmdb.popularTv() });
  const top = useQuery({ queryKey: ["topTv"], queryFn: () => tmdb.topTv() });
  const airing = useQuery({ queryKey: ["airingToday"], queryFn: () => tmdb.airingToday() });
  const onAir = useQuery({ queryKey: ["onAirTv"], queryFn: () => tmdb.onTheAir() });
  return (
    <div>
      <HeroBanner items={trending.data?.results ?? []} />
      <div className="-mt-16 relative z-10 space-y-2">
        <MediaRow title="Trending Series" items={trending.data?.results ?? []} forceType="tv" />
        <MediaRow title="Airing Today" items={airing.data?.results ?? []} forceType="tv" />
        <MediaRow title="On The Air" items={onAir.data?.results ?? []} forceType="tv" />
        <MediaRow title="Popular" items={popular.data?.results ?? []} forceType="tv" />
        <MediaRow title="Top Rated" items={top.data?.results ?? []} forceType="tv" />
      </div>
    </div>
  );
}
