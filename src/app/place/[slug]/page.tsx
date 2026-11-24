import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import LockedCard from "@/components/ui/LockedCard";
import {
  CategoryIcon,
  IconArrowLeft,
  IconArrowRight,
  IconPin,
} from "@/components/icons";
import { categoryById, FOOD_SUBCATEGORIES, places as fallbackPlaces } from "@/data/places";
import { getPlaceBySlug } from "@/lib/data";
import { placeSlug } from "@/lib/slug";
import CopyButton from "./CopyButton";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return fallbackPlaces.map((p) => ({ slug: placeSlug(p) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getPlaceBySlug(params.slug);
  if (!data) return { title: "Место не найдено — Санья Гид" };
  return {
    title: `${data.place.name} — Санья Гид`,
    description: data.place.shortDescription,
    openGraph: {
      title: `${data.place.name} — Санья Гид`,
      description: data.place.shortDescription,
    },
  };
}

const gradients = [
  "from-pastel to-blush",
  "from-blush to-pastel",
  "from-pastel via-blush to-pastel",
];

export default async function PlacePage({ params }: Params) {
  const data = await getPlaceBySlug(params.slug);
  if (!data) notFound();

  const { place, fullDescription, citySlug, unlocked } = data;
  const category = categoryById(place.category);
  const phrase = `你好，请带我去：${place.nameZh || place.name}`;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Link
          href={`/city/${citySlug}`}
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-deep transition-colors hover:text-accent"
        >
          <IconArrowLeft size={18} /> К карте города
        </Link>

        {/* Фотогалерея: реальное фото, если есть, дальше заглушки */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {place.photoUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-blush">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={place.photoUrl}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {gradients
            .slice(0, place.photoUrl ? 2 : 3)
            .map((g, i) => (
              <div
                key={g}
                className={`relative aspect-[4/3] overflow-hidden rounded-card border border-blush bg-gradient-to-br ${g} ${
                  !place.photoUrl && i === 0 ? "" : "hidden sm:block"
                }`}
              >
                <CategoryIcon
                  id={place.category}
                  className="absolute inset-0 m-auto text-deep/20"
                  size={64}
                />
                <span className="absolute bottom-2 left-3 text-xs font-bold text-deep/50">
                  {category.label}
                </span>
              </div>
            ))}
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{category.label}</Badge>
            {place.subcategory && (
              <Badge className="bg-blush">
                {FOOD_SUBCATEGORIES.find((s) => s.id === place.subcategory)
                  ?.label ?? place.subcategory}
              </Badge>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            {place.name}
          </h1>
          <p className="mt-3 text-muted">{place.shortDescription}</p>
        </div>

        {unlocked ? (
          <>
            <section className="mt-8 rounded-card border border-blush bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">О месте</h2>
              <p className="mt-3 text-muted">{fullDescription}</p>
            </section>

            <section className="mt-6 rounded-card border border-blush bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">Как добраться</h2>
              <p className="mt-3 whitespace-pre-line text-muted">
                {place.gettingThere || (
                  <>
                    Проще всего — на такси через DiDi: покажи водителю карточку
                    с названием ниже. Координаты для навигатора:{" "}
                    {place.lat.toFixed(4)}, {place.lng.toFixed(4)}. Обратно из
                    туристических мест такси ловится быстро, но в час пик
                    заложи запас по времени.
                  </>
                )}
              </p>
            </section>

            <section className="mt-6 rounded-card border border-blush bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">Цены</h2>
              <p className="mt-3 whitespace-pre-line text-muted">
                {place.prices ||
                  "Актуальные цены на билеты и как купить со скидкой — скоро допишу в карточку места."}
              </p>
            </section>

            <section className="mt-6 rounded-card border border-blush bg-gradient-to-br from-blush to-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">
                Покажи таксисту
              </h2>
              <p className="mt-3 text-2xl font-bold text-ink">{phrase}</p>
              {place.nameZh ? (
                <p className="mt-1 text-sm text-muted">
                  Ни хао, цин дай во цюй: {place.name}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">
                  китайское название скоро появится
                </p>
              )}
              <div className="mt-4">
                <CopyButton text={phrase} />
              </div>
            </section>
          </>
        ) : (
          <div className="mt-8">
            <LockedCard title={place.name}>
              <div className="space-y-3">
                <p className="text-sm text-muted">{place.shortDescription}</p>
                <p className="text-sm text-muted">
                  Здесь — полный разбор места: как добраться дешевле, точные
                  цены, лайфхаки без очередей и фраза для таксиста на
                  китайском. Всё проверено лично, без воды.
                </p>
                <p className="text-sm text-muted">
                  Плюс маршруты по округе и места рядом, которые любят сами
                  китайцы.
                </p>
              </div>
            </LockedCard>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`/city/${citySlug}?place=${params.slug}`} size="sm">
            <IconPin size={18} /> Показать на карте
          </Button>
          <Button href="/map" variant="secondary" size="sm">
            Все города <IconArrowRight size={18} />
          </Button>
        </div>
      </main>
    </>
  );
}
