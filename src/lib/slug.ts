const table: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e",
  ю: "yu", я: "ya",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => table[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Приоритет: осмысленный slug из БД → читаемый id ('dadonghai' у fallback)
// → транслит имени. uuid в slug/id (миграция 003 добила пустые slug из id
// для кириллических имён) осмысленным не считаем.
export function placeSlug(p: {
  id: string;
  name: string;
  slug?: string | null;
}): string {
  if (p.slug && !UUID_RE.test(p.slug)) return p.slug;
  if (/^[a-z0-9-]+$/.test(p.id) && p.id.length < 40 && !UUID_RE.test(p.id))
    return p.id;
  return slugify(p.name);
}
