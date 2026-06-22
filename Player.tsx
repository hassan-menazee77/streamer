import { useEffect, useState } from "react";

type Provider = "vidlink" | "vidsrc";

const KEY = "streamr.provider";

function buildUrl(provider: Provider, type: "movie" | "tv", id: string | number, season?: number, episode?: number) {
  if (provider === "vidlink") {
    return type === "movie"
      ? `https://vidlink.pro/movie/${id}`
      : `https://vidlink.pro/tv/${id}/${season}/${episode}`;
  }
  return type === "movie"
    ? `https://vidsrc.me/embed/movie?tmdb=${id}`
    : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
}

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
  const [provider, setProvider] = useState<Provider>("vidlink");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem(KEY) as Provider)) || null;
    if (stored === "vidlink" || stored === "vidsrc") setProvider(stored);
  }, []);

  const change = (p: Provider) => {
    setProvider(p);
    try { localStorage.setItem(KEY, p); } catch {}
  };

  const src = buildUrl(provider, type, id, season, episode);

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden rounded-lg bg-black shadow-[var(--shadow-glow)]" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          key={src}
          src={src}
          allowFullScreen
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full"
          title="Player"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Source:</span>
        {(["vidlink", "vidsrc"] as Provider[]).map((p) => (
          <button
            key={p}
            onClick={() => change(p)}
            className={
              "rounded-md border px-3 py-1 text-xs font-medium transition " +
              (provider === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-secondary hover:bg-secondary/70")
            }
          >
            {p === "vidlink" ? "VidLink" : "VidSrc"}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          Tip: if a source fails to load, switch providers.
        </span>
      </div>
    </div>
  );
}
