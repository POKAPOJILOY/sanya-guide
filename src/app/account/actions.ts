"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEVICE_SESSION_COOKIE } from "@/lib/session";

export async function claimSession() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = crypto.randomUUID();
  await supabase.from("profiles").update({ session_id: id }).eq("id", user.id);
  cookies().set(DEVICE_SESSION_COOKIE, id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/account");
}
