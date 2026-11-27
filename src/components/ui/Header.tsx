import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Button from "./Button";
import MobileNav from "./MobileNav";

const links = [
  { href: "/map", label: "Карта" },
  { href: "/#course", label: "Курс" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#faq", label: "FAQ" },
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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4">
        <Link href="/" className="shrink-0 font-display text-xl font-bold text-deep sm:text-2xl">
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
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden text-sm font-semibold text-deep transition-colors hover:text-accent md:inline"
            >
              Админка
            </Link>
          )}
          {nickname ? (
            <Button href="/account" size="sm" variant="secondary" className="hidden max-w-40 truncate sm:inline-flex">
              {nickname}
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-deep transition-colors hover:text-accent sm:inline"
              >
                Войти
              </Link>
              <Button href="/register" size="sm" className="px-3 sm:px-4">
                Купить доступ
              </Button>
            </>
          )}
          <MobileNav nickname={nickname} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
