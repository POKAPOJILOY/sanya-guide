import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SessionConflict from "@/components/SessionConflict";
import { IconCrown, IconFlower } from "@/components/icons";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import { createClient } from "@/lib/supabase/server";
import { DEVICE_SESSION_COOKIE } from "@/lib/session";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: "Профиль — Санья Гид",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, role, session_id")
    .eq("id", user.id)
    .single();

  const deviceSession = cookies().get(DEVICE_SESSION_COOKIE)?.value;

  if (!profile?.session_id || profile.session_id !== deviceSession) {
    return (
      <>
        <Header />
        <SessionConflict />
      </>
    );
  }

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, city_id")
    .eq("user_id", user.id)
    .eq("status", "succeeded");

  const hasAll = purchases?.some((p) => p.city_id === null) ?? false;
  const cityAccess = purchases?.filter((p) => p.city_id !== null).length ?? 0;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <div className="text-center">
          <span className="inline-flex text-deep">
            <IconFlower size={52} />
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold">
            {profile.nickname || "Красотка"}
          </h1>
          <p className="mt-1 text-muted">{user.email}</p>
          {profile.role === "admin" && (
            <div className="mt-2">
              <Badge>
                <IconCrown size={14} /> админ
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-card border border-blush bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold">Твой доступ</h2>
          {hasAll || cityAccess > 0 ? (
            <p className="mt-2 text-sm text-muted">
              {hasAll
                ? "Полный доступ ко всем городам"
                : `Открыто городов: ${cityAccess}`}
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">
                Полная версия откроется после покупки — со всеми местами,
                уроками и чек-листами.
              </p>
              <div className="mt-4">
                <Button href="#" size="sm">
                  Купить доступ
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <LogoutButton />
        </div>
      </main>
    </>
  );
}
