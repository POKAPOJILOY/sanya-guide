import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Button from "./Button";

const links = [
  { href: "/map", label: "Карта" },
  { href: "#course", label: "Курс" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "FAQ" },
];

export default async function Header() {
  let nickname: string | null = null;
  let isAdmin = false;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname, role")
        .eq("id", user.id)
        .single();
      nickname = profile?.nickname ?? user.email ?? "Профиль";
      isAdmin = profile?.role === "admin";
    }
  } catch {
    // Supabase недоступен — показываем шапку для гостя
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blush bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-2xl font-bold text-deep">
          Санья Гид
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-deep transition-colors hover:text-accent"
            >
              Админка
            </Link>
          )}
          {nickname ? (
            <Button href="/account" size="sm" variant="secondary">
              {nickname}
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-deep transition-colors hover:text-accent"
              >
                Войти
              </Link>
              <Button href="#" size="sm">
                Купить доступ
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
