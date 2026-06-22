// TMDB v3 API helper. The v3 API key is safe to use client-side per TMDB docs.
export const TMDB_API_KEY = "e06e50783ddd2bee015d760bd44d07c9";
export const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = "https://image.tmdb.org/t/p";

export const img = (path: string | null | undefined, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500") =>
  path ? `${TMDB_IMG}/${size}${path}` : "";

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
}

export type Media = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
};

export type ListResponse<T> = { page: number; results: T[]; total_pages: number };

export const tmdb = {
  trending: (window: "day" | "week" = "week") =>
    get<ListResponse<Media>>(`/trending/all/${window}`),
  trendingMovies: () => get<ListResponse<Media>>(`/trending/movie/week`),
  trendingTv: () => get<ListResponse<Media>>(`/trending/tv/week`),
  popularMovies: (page = 1) => get<ListResponse<Media>>(`/movie/popular`, { page }),
  topMovies: (page = 1) => get<ListResponse<Media>>(`/movie/top_rated`, { page }),
  upcomingMovies: () => get<ListResponse<Media>>(`/movie/upcoming`),
  nowPlaying: () => get<ListResponse<Media>>(`/movie/now_playing`),
  popularTv: (page = 1) => get<ListResponse<Media>>(`/tv/popular`, { page }),
  topTv: (page = 1) => get<ListResponse<Media>>(`/tv/top_rated`, { page }),
  airingToday: () => get<ListResponse<Media>>(`/tv/airing_today`),
  onTheAir: () => get<ListResponse<Media>>(`/tv/on_the_air`),
  search: (query: string, page = 1) =>
    get<ListResponse<Media>>(`/search/multi`, { query, page, include_adult: "false" }),
  movieDetails: (id: number | string) =>
    get<any>(`/movie/${id}`, { append_to_response: "credits,videos,similar,external_ids" }),
  tvDetails: (id: number | string) =>
    get<any>(`/tv/${id}`, { append_to_response: "credits,videos,similar,external_ids" }),
  season: (id: number | string, season: number) =>
    get<any>(`/tv/${id}/season/${season}`),
  discoverMovies: (page = 1) => get<ListResponse<Media>>(`/discover/movie`, { page, sort_by: "popularity.desc" }),
  discoverTv: (page = 1) => get<ListResponse<Media>>(`/discover/tv`, { page, sort_by: "popularity.desc" }),
};

export const title = (m: Media) => m.title || m.name || "Untitled";
export const year = (m: Media) => (m.release_date || m.first_air_date || "").slice(0, 4);
