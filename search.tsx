import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { tmdb } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search — Streamr" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data, isFetching } = useQuery({
    queryKey: ["search", q],
    queryFn: () => tmdb.search(q),
    enabled: q.length > 1,
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-24 md:px-8">
      <h1 className="display text-3xl font-bold">
        {q ? <>Results for "<span className="text-primary">{q}</span>"</> : "Search"}
      </h1>
      {!q && <p className="mt-2 text-muted-foreground">Use the search box above to find movies and TV shows.</p>}
      {isFetching && <p className="mt-6 text-muted-foreground">Searching…</p>}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(data?.results ?? [])
          .filter((m) => m.media_type === "movie" || m.media_type === "tv")
          .map((m) => (
            <div key={`${m.id}-${m.media_type}`} className="flex justify-center">
              <MediaCard item={m} />
            </div>
          ))}
      </div>
      {data && data.results.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">No results found.</p>
      )}
    </div>
  );
}
