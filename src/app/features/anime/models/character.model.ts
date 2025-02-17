import { JikanImage } from "./base.model";

export interface Character {
  role?: string;
  mal_id: number;
  url: string;
  images: JikanImage;
  name: string;
  name_kanji?: string;
  nicknames?: string[];
  favorites: number;
  about?: string;
  voice_actors?: {
    person: {
      mal_id: number;
      url: string;
      images: JikanImage;
      name: string;
    };
    language: string;
  }[];
}

export type CharacterCardMode = "default" | "anime-details";
export type CharacterInput = Character | { character: Character };
