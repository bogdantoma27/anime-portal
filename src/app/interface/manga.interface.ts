export interface Manga {
  mal_id: number;
  title: string;
  synopsis: string;
  chapters: number;
  score: number;
  images: { jpg: { image_url: string } };
}
export interface MangaResponse {
  data: Manga;
}
export interface MangaSearchResponse {
  data: Manga[];
  pagination: { last_visible_page: number; has_next_page: boolean };
}
