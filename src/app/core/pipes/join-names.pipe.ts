import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "joinNames",
  standalone: true,
})
export class JoinNamesPipe implements PipeTransform {
  transform(
    items:
      | { mal_id: number; type: string; name: string; url: string }[]
      | { mal_id: number; type: string; name: string; url: string }
      | undefined
  ): string {
    // If items is undefined, return empty string
    if (!items) return "";

    // If items is an array, map and join names
    if (Array.isArray(items)) {
      return items.map((item) => item.name).join(", ");
    }

    // If items is a single object, return its name
    return "";
  }
}
