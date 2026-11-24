export const MAPTILER_ATTRIBUTION =
  '<a href="https://www.maptiler.com/copyright/">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> contributors';

export function mapTilerUrl(): string | null {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  return key
    ? `https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=${key}`
    : null;
}
