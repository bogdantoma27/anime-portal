export interface Review {
  mal_id: number;
  content: string;
  reviewer: { username: string; };
}
export interface ReviewsResponse {
  data: Review[];
}
