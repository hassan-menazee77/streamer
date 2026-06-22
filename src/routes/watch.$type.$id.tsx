import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Star, Plus, Check, Clock, Calendar } from "lucide-react";
import { tmdb, img } from "@/lib/tmdb";
import { Player } from "@/components/Player";
import { MediaRow } from "@/components/MediaRow";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/watch/$type/$id")({
  parseParams: ({ type, id }) => {
    if (type !== "movie" && type !== "tv") throw notFound();
    return { type: type as "movie" | "tv", id };
  },
  component: WatchPage,
});

function WatchPage() {
  const { type, id } = Route.useParams();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const detailsQ = useQuery({
    queryKey: [type, id],
    queryFn: () => (type === "movie" ? tmdb.movieDetails(id) : tmdb.tvDetails(id)),
  });
  const data = detailsQ.data;

  const seasonQ = useQuery({
    queryKey: ["season", id, season],
    queryFn: () => tmdb.season(id, season),
    enabled: type === "tv" && !!data,
  });

  useEffect(() => {
    // Reset to first available season on title change
    setSeason(1);
    setEpisode(1);
    window.scrollTo({ top: 0 });
  }, [id, type]);

  const watchlistQ = useQuery({
    queryKey: ["watchlist-item", user?.id, id, type],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("tmdb_id", Number(id))
        .eq("media_type", type)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });
  const inList = !!watchlistQ.data;

  const toggleList = useMutation({
    mutationFn: async () => {
      if (!user || !data) return;
      if (inList) {
        await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", Number(id))
          .eq("media_type", type);
      } else {
        await supabase.from("watchlist").insert({
          user_id: user.id,
          tmdb_id: Number(id),
          media_type: type,
          title: data.title || data.name,
          poster_path: data.poster_path,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist-item", user?.id, id, type] });
      qc.invalidateQueries({ queryKey: ["watchlist", user?.id] });
    },
  });

  if (detailsQ.isLoading || !data) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  const title = data.title || data.name;
  const releaseDate = data.release_date || data.first_air_date;
  const runtime = data.runtime || (data.episode_run_time?.[0] ?? null);
  const seasons = (data.seasons ?? []).filter((s: any) => s.season_number > 0);
  const cast = data.credits?.cast?.slice(0, 8) ?? [];
  const similar = data.similar?.results ?? [];

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
        {data.backdrop_path && (
          <img src={img(data.backdrop_path, "original")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero-side)" }} />
      </div>

      <div className="mx-auto -mt-48 max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-8">
          {data.poster_path && (
            <img
              src={img(data.poster_path, "w500")}
              alt={title}
              className="hidden w-[200px] rounded-lg shadow-xl md:block"
            />
          )}
          <div className="relative z-10 space-y-4">
            <h1 className="display text-4xl font-bold md:text-5xl">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {!!data.vote_average && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" /> {data.vote_average.toFixed(1)}
                </span>
              )}
              {releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {releaseDate.slice(0, 4)}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {runtime}m
                </span>
              )}
              {data.genres?.map((g: any) => (
                <span key={g.id} className="rounded border border-border px-2 py-0.5 text-xs">{g.name}</span>
              ))}
            </div>
            <p className="max-w-3xl text-foreground/85">{data.overview}</p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <button
                  onClick={() => toggleList.mutate()}
                  disabled={toggleList.isPending}
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/70"
                >
                  {inList ? <><Check className="h-4 w-4" /> In My List</> : <><Plus className="h-4 w-4" /> My List</>}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/70"
                >
                  <Plus className="h-4 w-4" /> Sign in to save
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TV episode selector */}
        {type === "tv" && seasons.length > 0 && (
          <div className="mt-10 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-muted-foreground">Season</label>
              <select
                value={season}
                onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
                className="rounded-md border border-input bg-secondary px-3 py-1.5 text-sm"
              >
                {seasons.map((s: any) => (
                  <option key={s.id} value={s.season_number}>
                    {s.name} ({s.episode_count} eps)
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground">
                Now playing: <span className="text-foreground font-semibold">S{season} · E{episode}</span>
              </span>
            </div>
          </div>
        )}

        {/* Player */}
        <div className="mt-6">
          <Player type={type} id={id} season={season} episode={episode} />
        </div>

        {/* Episodes grid */}
        {type === "tv" && seasonQ.data?.episodes?.length > 0 && (
          <section className="mt-10">
            <h2 className="display text-2xl font-bold">Episodes</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {seasonQ.data.episodes.map((ep: any) => {
                const active = ep.episode_number === episode;
                return (
                  <button
                    key={ep.id}
                    onClick={() => { setEpisode(ep.episode_number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={
                      "group flex gap-3 rounded-lg border p-2 text-left transition " +
                      (active ? "border-primary bg-primary/10" : "border-border hover:border-input bg-card")
                    }
                  >
                    <div className="aspect-video w-32 shrink-0 overflow-hidden rounded bg-secondary">
                      {ep.still_path ? (
                        <img src={img(ep.still_path, "w300")} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        E{ep.episode_number}. {ep.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ep.overview}</p>
                      {ep.air_date && <p className="mt-1 text-[10px] text-muted-foreground">{ep.air_date}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-10">
            <h2 className="display text-2xl font-bold">Cast</h2>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {cast.map((c: any) => (
                <div key={c.id} className="w-24 shrink-0 text-center">
                  <div className="aspect-square w-24 overflow-hidden rounded-full bg-secondary">
                    {c.profile_path && (
                      <img src={img(c.profile_path, "w200")} alt={c.name} className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <p className="mt-2 truncate text-xs font-medium">{c.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-6">
            <MediaRow title="More like this" items={similar} forceType={type} />
          </div>
        )}
      </div>
    </div>
  );
}
