import { JikanImage } from "./base.model";

export interface AnimeSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
  score?: number;
  min_score?: number;
  max_score?: number;
  status?: "airing" | "complete" | "upcoming";
  rating?: string;
  genres?: number[];
  genre_exclude?: boolean;
  order_by?: string;
  sort?: "asc" | "desc";
}

export interface AnimeResult {
  mal_id: number;
  url: string;
  images: JikanImage;
  title: string;
  title_english?: string;
  title_japanese?: string;
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
    images: {
      image_url: string;
      small_image_url: string;
      medium_image_url: string;
      large_image_url: string;
      maximum_image_url: string;
    };
  };
  type: string;
  source?: string;
  episodes?: number;
  genres?: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  };
  status: string;
  aired: {
    from: string;
    to: string;
    prop: {
      from: { day: number; month: number; year: number };
      to: { day: number; month: number; year: number };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
}

export type AnimeContext =
  | "anime"
  | "airing"
  | "upcoming"
  | "movies"
  | "popular"
  | "favorite"
  | "default";
