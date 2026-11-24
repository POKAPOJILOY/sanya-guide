"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEVICE_SESSION_COOKIE } from "@/lib/session";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = `${DEVICE_SESSION_COOKIE}=; path=/; max-age=0`;
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pastel bg-card px-7 py-3.5 font-semibold text-deep shadow-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-lift"
    >
      {loading ? "Выхожу…" : "Выйти"}
    </button>
  );
}
