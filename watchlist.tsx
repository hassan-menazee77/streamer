import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { img } from "@/lib/tmdb";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "My List — Streamr" }] }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { user, loading } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .order("added_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  if (loading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 pt-32 text-center">
        <h1 className="display text-3xl font-bold">My List</h1>
        <p className="mt-2 text-muted-foreground">Sign in to save movies and TV shows to your personal list.</p>
        <Link to="/auth" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-24 md:px-8">
      <h1 className="display text-3xl font-bold">My List</h1>
      {isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
      {data && data.length === 0 && (
        <p className="mt-6 text-muted-foreground">Your list is empty. Browse and tap “My List” on any title.</p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(data ?? []).map((item: any) => (
          <Link
            key={item.id}
            to="/watch/$type/$id"
            params={{ type: item.media_type, id: String(item.tmdb_id) }}
            className="group overflow-hidden rounded-md bg-secondary"
          >
            <div className="aspect-[2/3]">
              {item.poster_path ? (
                <img
                  src={img(item.poster_path, "w500")}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">{item.title}</div>
              )}
            </div>
            <p className="truncate p-2 text-sm">{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
