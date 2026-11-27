import { categories, places as fallbackPlaces, type Place } from "@/data/places";
import { placeSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

export type City = {
  slug: string;
  name: string;
  emoji: string;
  status: "active" | "coming_soon" | "draft";
};

const fallbackCities: City[] = [
  { slug: "sanya", name: "Санья", emoji: "🌴", status: "active" },
  { slug: "beijing", name: "Пекин", emoji: "🏯", status: "coming_soon" },
  { slug: "shanghai", name: "Шанхай", emoji: "🌃", status: "coming_soon" },
  { slug: "guangzhou", name: "Гуанчжоу", emoji: "🥟", status: "coming_soon" },
  { slug: "shenzhen", name: "Шэньчжэнь", emoji: "🎡", status: "coming_soon" },
  { slug: "chengdu", name: "Чэнду", emoji: "🐼", status: "coming_soon" },
  { slug: "chongqing", name: "Чунцин", emoji: "🌶️", status: "coming_soon" },
  { slug: "hangzhou", name: "Ханчжоу", emoji: "🍵", status: "coming_soon" },
  { slug: "xian", name: "Сиань", emoji: "🗿", status: "coming_soon" },
  { slug: "guilin", name: "Гуйлинь", emoji: "🏞️", status: "coming_soon" },
  { slug: "harbin", name: "Харбин", emoji: "❄️", status: "coming_soon" },
];

export async function getCities(): Promise<City[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cities")
      .select("slug, name, emoji, status")
      .order("sort");
    if (error || !data?.length) return fallbackCities;
    return data;
  } catch {
    return fallbackCities;
  }
}

export async function getPlaces(citySlug: string): Promise<Place[]> {
  try {
    const supabase = createClient();
    const { data: city, error: cityError } = await supabase
      .from("cities")
      .select("id")
      .eq("slug", citySlug)
      .single();
    if (cityError || !city) return fallbackPlaces;

    const { data, error } = await supabase
      .from("public_places")
      .select("*")
      .eq("city_id", city.id)
      .order("sort");
    if (error || !data?.length) return fallbackPlaces;

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      nameZh: p.name_zh ?? "",
      category: categories.some((c) => c.id === p.category)
        ? (p.category as Place["category"])
        : "sights",
      lat: p.lat,
      lng: p.lng,
      isFree: p.is_free,
      emoji: p.emoji,
      shortDescription: p.short_description,
      subcategory: p.subcategory ?? undefined,
      gettingThere: "",
      prices: "",
      photoUrl: p.photo_url ?? "",
      workingHours: "",
      address: "",
      amapUrl: "",
    }));
  } catch {
    return fallbackPlaces;
  }
}

export async function getPlacesCount(citySlug: string): Promise<number> {
  try {
    const supabase = createClient();
    const { data: city, error: cityError } = await supabase
      .from("cities")
      .select("id")
      .eq("slug", citySlug)
      .single();
    if (cityError || !city) return fallbackPlaces.length;

    const { count, error } = await supabase
      .from("public_places")
      .select("*", { count: "exact", head: true })
      .eq("city_id", city.id);
    if (error || count === null) return fallbackPlaces.length;
    return count;
  } catch {
    return fallbackPlaces.length;
  }
}

export type PlacePage = {
  place: Place;
  fullDescription: string;
  citySlug: string;
  unlocked: boolean;
};

// Полный платный доступ: покупка курса (все города или конкретный) или админ.
// Бесплатные места открываются отдельно по is_free, без обязательной покупки.
async function checkAccess(
  supabase: ReturnType<typeof createClient>,
  cityId: string | null
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role === "admin") return true;

  const { data: purchases } = await supabase
    .from("purchases")
    .select("city_id")
    .eq("user_id", user.id)
    .eq("status", "succeeded");
  return (
    purchases?.some((p) => p.city_id === null || p.city_id === cityId) ?? false
  );
}

export async function getPlaceBySlug(slug: string): Promise<PlacePage | null> {
  // fallback без БД: slug совпадает с id места из src/data/places.ts
  const fb = fallbackPlaces.find((p) => placeSlug(p) === slug) ?? null;

  try {
    const supabase = createClient();
    const { data: pubs } = await supabase.from("public_places").select("*");
    const row = pubs?.find((r) => placeSlug(r) === slug);
    if (!row) {
      const unlocked = fb?.isFree
        ? true
        : await checkAccess(supabase, null);
      return fb
        ? {
            place: fb,
            fullDescription: fb.shortDescription,
            citySlug: "sanya",
            unlocked,
          }
        : null;
    }

    const place: Place = {
      id: row.id,
      name: row.name,
      nameZh: row.name_zh ?? "",
      category: categories.some((c) => c.id === row.category)
        ? (row.category as Place["category"])
        : "sights",
      lat: row.lat,
      lng: row.lng,
      isFree: row.is_free,
      emoji: row.emoji,
      shortDescription: row.short_description,
      subcategory: row.subcategory ?? undefined,
      gettingThere: "",
      prices: "",
      photoUrl: row.photo_url ?? "",
      workingHours: "",
      address: "",
      amapUrl: "",
    };

    const isFree = Boolean(row.is_free);
    const unlocked = isFree || (await checkAccess(supabase, row.city_id));

    // полные поля читаем из places только при купленном доступе
    let full: {
      full_description: string;
      getting_there?: string;
      prices?: string;
      working_hours?: string;
      address?: string;
      amap_url?: string;
    } | null = null;

    if (unlocked) {
      const res = await supabase
        .from("places")
        .select("full_description, getting_there, prices, working_hours, address, amap_url")
        .eq("id", row.id)
        .maybeSingle();

      full = res.data;
      if (res.error) {
        // колонок 004 может ещё не быть в базе — читаем только full_description
        const retry = await supabase
          .from("places")
          .select("full_description")
          .eq("id", row.id)
          .maybeSingle();
        full = retry.data;
      }
    }

    const { data: city } = await supabase
      .from("cities")
      .select("slug")
      .eq("id", row.city_id)
      .single();

    place.gettingThere = full?.getting_there ?? "";
    place.prices = full?.prices ?? "";
    place.workingHours = full?.working_hours ?? "";
    place.address = full?.address ?? "";
    place.amapUrl = full?.amap_url ?? "";

    return {
      place,
      fullDescription:
        full?.full_description ?? (isFree ? row.short_description : ""),
      citySlug: city?.slug ?? "sanya",
      unlocked: unlocked && (isFree || full !== null),
    };
  } catch {
    return fb
      ? {
          place: fb,
          fullDescription: fb.shortDescription,
          citySlug: "sanya",
          unlocked: fb.isFree,
        }
      : null;
  }
}
