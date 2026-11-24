import type { Metadata } from "next";
import Link from "next/link";
import FreemiumBar from "@/components/FreemiumBar";
import Badge from "@/components/ui/Badge";
import Header from "@/components/ui/Header";
import { IconArrowRight, IconLock, IconPalm, IconPin } from "@/components/icons";
import { getCities } from "@/lib/data";
import ChinaMap from "./ChinaMap";

export const metadata: Metadata = {
  title: "Выбери город — Санья Гид",
  description:
    "Интерактивная карта городов курса: Санья уже открыта, Пекин, Шанхай и другие города — скоро. Покупатели курса получат все города бесплатно.",
};

export default async function MapPage() {
  const cities = await getCities();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            Выбери город
          </h1>
          <p className="mt-2 text-xl font-semibold text-accent md:text-2xl">
            начинаем с Санья
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <ChinaMap />
            <Link
              href="/city/sanya"
              className="mt-6 flex min-h-[56px] items-center justify-between gap-3 rounded-card border border-blush bg-card px-6 py-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="inline-flex items-center gap-2 font-display text-lg font-bold text-ink">
                <IconPalm size={24} className="text-deep" /> Санья — открыта!
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-deep">
                Смотреть места <IconArrowRight size={18} />
              </span>
            </Link>
          </div>

          <aside className="rounded-card border border-blush bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold">Города курса</h2>
            <ul className="mt-4 space-y-2">
              {cities.map((city) =>
                city.status === "active" ? (
                  <li key={city.slug}>
                    <Link
                      href={`/city/${city.slug}`}
                      className="flex min-h-[44px] items-center justify-between gap-2 rounded-2xl bg-blush px-4 py-2 font-semibold text-deep transition-colors hover:bg-pastel"
                    >
                      <span className="inline-flex items-center gap-2">
                        <IconPin size={18} className="text-deep" />
                        {city.name}
                      </span>
                      <span className="text-sm font-semibold text-deep">
                        открыто
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li
                    key={city.slug}
                    className="flex min-h-[44px] items-center justify-between gap-2 rounded-2xl px-4 py-2 text-muted"
                  >
                    <span className="inline-flex items-center gap-2">
                      <IconLock size={16} />
                      {city.name}
                    </span>
                    <Badge>Скоро</Badge>
                  </li>
                )
              )}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Все будущие города — бесплатно для покупателей курса.
            </p>
          </aside>
        </div>
      </main>
      <FreemiumBar />
    </>
  );
}
