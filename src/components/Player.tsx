import { useState } from "react";

export function Player({
  type,
  id,
  season,
  episode,
}: {
  type: "movie" | "tv";
  id: string | number;
  season?: number;
  episode?: number;
}) {
  const [source, setSource] = useState("vidsrc");

  const encodedId = encodeURIComponent(id);
  const encodedSeason = season ? encodeURIComponent(season) : undefined;
  const encodedEpisode = episode ? encodeURIComponent(episode) : undefined;

  const sources = {
    vidsrc:
      type === "movie"
        ? `https://vidsrc.me/embed/movie?tmdb=${encodedId}`
        : `https://vidsrc.me/embed/tv?tmdb=${encodedId}&season=${encodedSeason}&episode=${encodedEpisode}`,
    vidlink:
      type === "movie"
        ? `https://vidlink.pro/embed/movie?tmdb=${encodedId}`
        : `https://vidlink.pro/embed/tv?tmdb=${encodedId}&season=${encodedSeason}&episode=${encodedEpisode}`,
  };

  const src = sources[source as keyof typeof sources];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={() => setSource("vidsrc")} className={`px-3 py-1 text-sm rounded-md ${source === 'vidsrc' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>VidSrc</button>
        <button onClick={() => setSource("vidlink")} className={`px-3 py-1 text-sm rounded-md ${source === 'vidlink' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>VidLink</button>
      </div>
      <div
        className="relative grid w-full place-items-center overflow-hidden rounded-lg bg-black text-center shadow-[var(--shadow-glow)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <iframe
          key={src}
          src={src}
          allowFullScreen
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full"
          title="Player"
        />
      </div>
    </div>
  );
}
