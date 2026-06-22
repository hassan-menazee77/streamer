import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { img, title, year, type Media } from "@/lib/tmdb";

export function MediaCard({ item, forceType }: { item: Media; forceType?: "movie" | "tv" }) {
  const type = forceType || item.media_type || (item.title ? "movie" : "tv");
  if (type !== "movie" && type !== "tv") return null;
  const poster = img(item.poster_path, "w500");
  return (
    <Link
      to="/watch/$type/$id"
      params={{ type, id: String(item.id) }}
      className="group relative block w-[160px] shrink-0 overflow-hidden rounded-md bg-secondary md:w-[200px]"
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title(item)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">No image</div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold text-white">{title(item)}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase">{type}</span>
          <span>{year(item)}</span>
          {!!item.vote_average && (
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
