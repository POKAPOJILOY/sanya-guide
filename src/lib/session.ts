import type { SupabaseClient } from "@supabase/supabase-js";

export const DEVICE_SESSION_COOKIE = "device_session";

export async function claimDeviceSession(
  supabase: SupabaseClient,
  userId: string
) {
  // crypto.randomUUID недоступен вне secure context (http://192.168.x.x на телефоне)
  const id =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  await supabase.from("profiles").update({ session_id: id }).eq("id", userId);
  document.cookie = `${DEVICE_SESSION_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
}
