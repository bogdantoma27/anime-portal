export interface Recommendation {
  mal_id: number;
  entry: { mal_id: number; title: string; };
}
export interface RecommendationsResponse {
  data: Recommendation[];
}
