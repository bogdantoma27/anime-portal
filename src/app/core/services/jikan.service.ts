import { Injectable, inject } from "@angular/core";
import { AnimeService } from "../../features/anime/services/anime.service";
import { CharacterService } from "../../features/anime/services/character.service";
import { SeasonService } from "../../features/anime/services/season.service";

@Injectable({ providedIn: "root" })
export class JikanService {
  anime = inject(AnimeService);
  season = inject(SeasonService);
  character = inject(CharacterService);
}
