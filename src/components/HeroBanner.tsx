import { Link } from "@tanstack/react-router";
import { Play, Info, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { img, title, year, type Media } from "@/lib/tmdb";

export function HeroBanner({ items }: { items: Media[] }) {
  const [idx, setIdx] = useState(0);
  const featured = items.slice(0, 5);
  useEffect(() => {
    if (featured.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % featured.length), 7000);
    return () => clearInterval(id);
  }, [featured.length]);
  const m = featured[idx];
  if (!m) return <div className="h-[60vh] bg-card" />;
  const type = m.media_type === "tv" || m.first_air_date ? "tv" : "movie";
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <img
        key={m.id}
        src={img(m.backdrop_path || m.poster_path, "original")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-700"
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero-side)" }} />
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end gap-4 px-4 pb-16 md:px-8 md:pb-24">
        <span className="w-fit rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          {type === "tv" ? "Series" : "Movie"} · Featured
        </span>
        <h1 className="display max-w-2xl text-4xl font-bold leading-tight md:text-6xl">{title(m)}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {!!m.vote_average && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" /> {m.vote_average.toFixed(1)}
            </span>
          )}
          <span>{year(m)}</span>
        </div>
        <p className="line-clamp-3 max-w-xl text-sm text-foreground/85 md:text-base">{m.overview}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            to="/watch/$type/$id"
            params={{ type, id: String(m.id) }}
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 font-semibold text-black hover:bg-white/90"
          >
            <Play className="h-5 w-5 fill-current" /> Play
          </Link>
          <Link
            to="/watch/$type/$id"
            params={{ type, id: String(m.id) }}
            className="inline-flex items-center gap-2 rounded-md bg-secondary/80 px-6 py-2.5 font-semibold text-foreground backdrop-blur hover:bg-secondary"
          >
            <Info className="h-5 w-5" /> More Info
          </Link>
        </div>
      </div>
    </section>
  );
}
