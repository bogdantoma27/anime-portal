// Import enums from anime, manga, and season files
import { AnimeGenre, MediaType as AnimeMediaType, Status as AnimeStatus, SortOrder as AnimeSortOrder, OrderBy as AnimeOrderBy } from "../enums/anime.enum";
import { MangaGenre, MediaType as MangaMediaType, Status as MangaStatus, SortOrder as MangaSortOrder, OrderBy as MangaOrderBy } from "../enums/manga.enum";
import { SeasonType } from "../enums/season.enum";

// Utility function to map enum to an array of objects with 'id' and 'label' for use in dropdowns
function mapEnumToOptions(enumType: object) {
  return Object.entries(enumType)
    .filter(([key, value]) => isNaN(Number(key)))  // Filter out numeric values (to only keep string keys)
    .map(([key, value]) => ({
      id: value,  // The numeric value of the enum (useful for backend or form submissions)
      label: key.replace(/_/g, ' ').toLowerCase() .replace(/\b\w/g, (char) => char.toUpperCase())  // Capitalize the first letter of each word
    }));
}

// Anime Genres Mapping
// This uses the utility function to convert AnimeGenre enum to an array of label-value objects
export const ANIME_AVAILABLE_GENRES = mapEnumToOptions(AnimeGenre).sort((a, b) => a.label.localeCompare(b.label));  // Sort by label for alphabetical order

// Media Types for Anime
// Static list of media types available in the Anime MediaType enum, mapped to user-friendly labels
export const ANIME_MEDIA_OPTIONS = [
  { value: AnimeMediaType.TV, label: 'TV' },
  { value: AnimeMediaType.MOVIE, label: 'Movie' },
  { value: AnimeMediaType.OVA, label: 'OVA' },
  { value: AnimeMediaType.SPECIAL, label: 'Special' },
  { value: AnimeMediaType.ONA, label: 'ONA' },
  { value: AnimeMediaType.MUSIC, label: 'Music' }
];

// Anime Status Mapping
// Converts the AnimeStatus enum to an array of objects with 'value' and 'label' (capitalized) for display purposes
export const ANIME_STATUS_OPTIONS = Object.values(AnimeStatus).map((status) => ({
  value: status,  // The actual value of the status
  label: status.charAt(0).toUpperCase() + status.slice(1)  // Capitalizing the first letter for display purposes
}));

// Anime Order Options
// Static list for sorting Anime based on various fields (e.g., Title, Start Date)
export const ANIME_ORDER_OPTIONS = [
  { value: AnimeOrderBy.TITLE, label: 'Title' },
  { value: AnimeOrderBy.START_DATE, label: 'Start Date' },
  { value: AnimeOrderBy.END_DATE, label: 'End Date' },
  { value: AnimeOrderBy.EPISODES, label: 'Episodes' },
  { value: AnimeOrderBy.SCORE, label: 'Score' },
  { value: AnimeOrderBy.RANK, label: 'Rank' },
  { value: AnimeOrderBy.POPULARITY, label: 'Popularity' },
  { value: AnimeOrderBy.FAVORITES, label: 'Favorites' }
];

// Manga Genres Mapping
// This uses the utility function to convert MangaGenre enum to an array of label-value objects
export const MANGA_AVAILABLE_GENRES = mapEnumToOptions(MangaGenre).sort((a, b) => a.label.localeCompare(b.label));  // Sort by label for alphabetical order

// Media Types for Manga
// Static list of different media types for Manga, following the same structure as AnimeMediaOptions
export const MANGA_MEDIA_OPTIONS = [
  { value: MangaMediaType.MANGA, label: 'Manga' },
  { value: MangaMediaType.NOVEL, label: 'Novel' },
  { value: MangaMediaType.LIGHTNOVEL, label: 'Lightnovel' },
  { value: MangaMediaType.ONESHOT, label: 'Oneshot' },
  { value: MangaMediaType.DOUJIN, label: 'Doujin' },
  { value: MangaMediaType.MANHWA, label: 'Manhwa' },
  { value: MangaMediaType.MANHUA, label: 'Manhua' }
];

// Manga Status Mapping
// Converts the MangaStatus enum to an array of objects with 'value' and 'label' (capitalized) for display purposes
export const MANGA_STATUS_OPTIONS = Object.values(MangaStatus).map((status) => ({
  value: status,  // The actual value of the status
  label: status.charAt(0).toUpperCase() + status.slice(1)  // Capitalize the first letter for better UI readability
}));

// Manga Order Options
// Static list of sorting options for Manga data, following the same pattern as AnimeOrderOptions
export const MANGA_ORDER_OPTIONS = [
  { value: MangaOrderBy.TITLE, label: 'Title' },
  { value: MangaOrderBy.START_DATE, label: 'Start Date' },
  { value: MangaOrderBy.END_DATE, label: 'End Date' },
  { value: MangaOrderBy.CHAPTERS, label: 'Chapters' },
  { value: MangaOrderBy.VOLUMES, label: 'Volumes' },
  { value: MangaOrderBy.SCORE, label: 'Score' },
  { value: MangaOrderBy.RANK, label: 'Rank' },
  { value: MangaOrderBy.POPULARITY, label: 'Popularity' },
  { value: MangaOrderBy.FAVORITES, label: 'Favorites' }
];

// Season Options Mapping
// Converts the SeasonType enum to an array of objects with 'value' and 'label' for display purposes
export const SEASON_OPTIONS = Object.values(SeasonType).map((season) => ({
  value: season,  // The season type value
  label: season.charAt(0).toUpperCase() + season.slice(1)  // Capitalizing the first letter for better display
}));

// Media Types for Seasons
// Static list for media options in the context of Anime seasons
export const SEASON_MEDIA_OPTIONS = [
  { value: AnimeMediaType.TV, label: 'TV' },
  { value: AnimeMediaType.MOVIE, label: 'Movie' },
  { value: AnimeMediaType.OVA, label: 'OVA' },
  { value: AnimeMediaType.SPECIAL, label: 'Special' },
  { value: AnimeMediaType.ONA, label: 'ONA' },
  { value: AnimeMediaType.MUSIC, label: 'Music' }
];
