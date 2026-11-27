"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/map", label: "Карта" },
  { href: "/#course", label: "Курс" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#faq", label: "FAQ" },
];

export default function MobileNav({
  nickname,
  isAdmin,
}: {
  nickname: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-pastel bg-card text-deep shadow-soft transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep"
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? (
            <>
              <path d="m6 6 12 12" />
              <path d="M18 6 6 18" />
            </>
          ) : (
            <>
              <path d="M5 8h14" />
              <path d="M5 16h14" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Мобильная навигация"
          className="item-copy-enter absolute right-0 top-[calc(100%+14px)] w-60 overflow-hidden rounded-[22px] border border-blush bg-card p-2 shadow-lift"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[46px] items-center rounded-2xl px-4 font-display text-base font-bold text-ink transition-colors hover:bg-blush hover:text-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-blush pt-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex min-h-[46px] items-center rounded-2xl px-4 text-sm font-semibold text-deep transition-colors hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep"
              >
                Админка
              </Link>
            )}
            <Link
              href={nickname ? "/account" : "/login"}
              onClick={() => setOpen(false)}
              className="flex min-h-[46px] items-center rounded-2xl px-4 text-sm font-semibold text-deep transition-colors hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep"
            >
              {nickname ? `Профиль: ${nickname}` : "Войти"}
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
