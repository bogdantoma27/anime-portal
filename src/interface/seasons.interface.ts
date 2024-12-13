export interface Season {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  trailer: { url: string };
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  aired: { string: string };
  genres: { name: string }[];
  synopsis: string;
  score: number;
  members: number;
  popularity: number;
}

export interface SeasonsResponse {
  data: Season[];
}
