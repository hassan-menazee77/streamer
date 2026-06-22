import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "@/lib/tmdb";
import { MediaCard } from "./MediaCard";

export function MediaRow({
  title,
  items,
  forceType,
}: {
  title: string;
  items: Media[];
  forceType?: "movie" | "tv";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  if (!items?.length) return null;
  return (
    <section className="group/row relative py-4">
      <h2 className="mb-3 px-4 text-xl font-semibold md:px-8 display">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 hidden h-full -translate-y-1/2 items-center bg-gradient-to-r from-background/80 to-transparent px-2 opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-hide md:px-8"
        >
          {items.map((m) => (
            <MediaCard key={`${m.id}-${m.media_type ?? forceType}`} item={m} forceType={forceType} />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 hidden h-full -translate-y-1/2 items-center bg-gradient-to-l from-background/80 to-transparent px-2 opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
