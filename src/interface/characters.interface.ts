export interface Character {
  mal_id: number;
  name: string;
  about: string;
  images: { jpg: { image_url: string } };
}
export interface CharacterResponse {
  data: Character;
}
