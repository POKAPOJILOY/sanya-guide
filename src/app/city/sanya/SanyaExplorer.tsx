"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import Badge from "@/components/ui/Badge";
import LockedCard from "@/components/ui/LockedCard";
import { CategoryIcon } from "@/components/icons";
import { placeSlug } from "@/lib/slug";
import {
  categories,
  FOOD_SUBCATEGORIES,
  type CategoryId,
  type Place,
} from "@/data/places";

const SanyaMap = dynamic(() => import("./SanyaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-blush/40 text-muted">
      Загружаю карту…
    </div>
  ),
});

const plural = (n: number) =>
  n % 10 === 1 && n % 100 !== 11
    ? "место"
    : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)
      ? "места"
      : "мест";

function Thumb({ place }: { place: Place }) {
  const category = categories.find((c) => c.id === place.category)!;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-card bg-gradient-to-br from-pastel to-blush">
      <CategoryIcon
        id={place.category}
        className="absolute inset-0 m-auto text-deep/20"
        size={56}
      />
      <span className="absolute bottom-2 left-3 text-xs font-bold text-deep/50">
        {category.label}
      </span>
    </div>
  );
}

const subcategoryLabel = (id: string) =>
  FOOD_SUBCATEGORIES.find((s) => s.id === id)?.label ?? id;

export default function SanyaExplorer({
  places,
  focusSlug,
}: {
  places: Place[];
  focusSlug?: string;
}) {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [subcategory, setSubcategory] = useState<string | "all">("all");
  const listRef = useRef<HTMLDivElement | null>(null);

  const filtered = (
    category === "all" ? places : places.filter((p) => p.category === category)
  ).filter(
    (p) =>
      category !== "food" ||
      subcategory === "all" ||
      p.subcategory === subcategory
  );

  const focus = focusSlug
    ? (places.find((p) => placeSlug(p) === focusSlug) ?? null)
    : null;

  const pickCategory = (id: CategoryId | "all") => {
    const next = category === id ? "all" : id;
    setCategory(next);
    setSubcategory("all");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    requestAnimationFrame(() =>
      listRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      })
    );
  };

  return (
    <>
      {/* Фильтры */}
      <div
        role="group"
        aria-label="Фильтр по категориям"
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        {[{ id: "all" as const, label: "Все" }, ...categories].map((c) => {
          const isActive = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => pickCategory(c.id)}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "border-accent bg-accent text-white shadow-soft"
                  : "border-pastel bg-card text-deep hover:border-accent"
              }`}
            >
              {c.id !== "all" && (
                <CategoryIcon id={c.id as CategoryId} size={18} />
              )}
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Подкатегории еды */}
      {category === "food" && (
        <div
          role="group"
          aria-label="Фильтр по подкатегориям еды"
          className="mt-3 flex flex-wrap justify-center gap-2"
        >
          {[{ id: "all" as const, label: "Все" }, ...FOOD_SUBCATEGORIES].map(
            (s) => {
              const isActive = subcategory === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSubcategory(isActive ? "all" : s.id)}
                  className={`inline-flex min-h-[44px] items-center rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent text-white shadow-soft"
                      : "border-pastel bg-card text-deep hover:border-accent"
                  }`}
                >
                  {s.label}
                </button>
              );
            }
          )}
        </div>
      )}

      {/* Карта */}
      <div className="mt-6 h-[420px] overflow-hidden rounded-card border border-blush shadow-soft md:h-[520px]">
        <SanyaMap places={filtered} focus={focus} />
      </div>

      {/* Список мест */}
      <div ref={listRef} className="mt-8 scroll-mt-24">
        <h2 className="text-center font-display text-xl font-bold">
          Найдено: {filtered.length} {plural(filtered.length)}
        </h2>
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((place) =>
          place.isFree ? (
            <Link
              key={place.id}
              href={`/place/${placeSlug(place)}`}
              className="overflow-hidden rounded-card border border-blush bg-card shadow-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lift"
            >
              <Thumb place={place} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">
                    {place.name}
                  </h3>
                  {place.subcategory && (
                    <Badge>{subcategoryLabel(place.subcategory)}</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">
                  {place.shortDescription}
                </p>
              </div>
            </Link>
          ) : (
            <LockedCard key={place.id} title={place.name}>
              <Thumb place={place} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">
                    {place.name}
                  </h3>
                  {place.subcategory && (
                    <Badge>{subcategoryLabel(place.subcategory)}</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">
                  {place.shortDescription}
                </p>
              </div>
            </LockedCard>
          )
        )}
      </div>
    </>
  );
}
