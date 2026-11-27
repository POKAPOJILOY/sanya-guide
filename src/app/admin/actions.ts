"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/login");
}

const num = (v: FormDataEntryValue | null) => Number(String(v).replace(",", "."));

const fail = (message: string) => {
  const text = message.includes("duplicate key")
    ? "Такая запись уже есть — проверь slug/название"
    : message;
  redirect(`/admin?err=${encodeURIComponent(text)}`);
};

// Загрузка фото места в Supabase Storage (вызывается из формы места).
// Возвращает публичную ссылку на загруженный файл.
export async function uploadPlacePhoto(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Файл не выбран" };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Файл больше 10 МБ — сожми фото и попробуй снова" };
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("place-photos")
    .upload(path, file, { contentType: file.type || "image/jpeg" });
  if (error) return { error: error.message };

  const { data } = admin.storage.from("place-photos").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function addPlace(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("places").insert({
    city_id: String(formData.get("city_id")),
    category: String(formData.get("category")),
    name: String(formData.get("name")),
    name_zh: String(formData.get("name_zh") ?? ""),
    emoji: "📍",
    lat: num(formData.get("lat")),
    lng: num(formData.get("lng")),
    is_free: formData.get("is_free") === "on",
    subcategory: String(formData.get("subcategory") ?? "") || null,
    short_description: String(formData.get("short_description") ?? ""),
    full_description: String(formData.get("full_description") ?? ""),
    getting_there: String(formData.get("getting_there") ?? ""),
    prices: String(formData.get("prices") ?? ""),
    photo_url: String(formData.get("photo_url") ?? ""),
    sort: Number(formData.get("sort") || 0),
  });
  if (error) fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/city/sanya");
  redirect("/admin?ok=place-added");
}

export async function updatePlace(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const admin = createAdminClient();
  const { error } = await admin
    .from("places")
    .update({
      category: String(formData.get("category")),
      name: String(formData.get("name")),
      name_zh: String(formData.get("name_zh") ?? ""),
      lat: num(formData.get("lat")),
      lng: num(formData.get("lng")),
      is_free: formData.get("is_free") === "on",
      subcategory: String(formData.get("subcategory") ?? "") || null,
      short_description: String(formData.get("short_description") ?? ""),
      full_description: String(formData.get("full_description") ?? ""),
      getting_there: String(formData.get("getting_there") ?? ""),
      prices: String(formData.get("prices") ?? ""),
      photo_url: String(formData.get("photo_url") ?? ""),
      sort: Number(formData.get("sort") || 0),
    })
    .eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/city/sanya");
  redirect("/admin?ok=place-updated");
}

export async function deletePlace(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("places").delete().eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/city/sanya");
  redirect("/admin?ok=place-deleted");
}

export async function togglePlaceFree(id: string, isFree: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("places")
    .update({ is_free: isFree })
    .eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/city/sanya");
  redirect("/admin?ok=free-toggled");
}

export async function addCity(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("cities").insert({
    slug: String(formData.get("slug")),
    name: String(formData.get("name")),
    emoji: String(formData.get("emoji") || "🏙️"),
  });
  if (error) fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/map");
  redirect("/admin?ok=city-added");
}

export async function setCityStatus(id: string, status: string) {
  await requireAdmin();
  if (!["active", "coming_soon", "draft"].includes(status)) return;
  const admin = createAdminClient();
  const { error } = await admin.from("cities").update({ status }).eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/map");
  redirect("/admin?ok=city-status");
}
