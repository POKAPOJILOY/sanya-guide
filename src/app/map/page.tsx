import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FreemiumBar from "@/components/FreemiumBar";
import Header from "@/components/ui/Header";
import {
  IconArrowRight,
  IconGift,
  IconLock,
  IconPalm,
  IconPin,
} from "@/components/icons";
import { getCities } from "@/lib/data";
import ChinaMap from "./ChinaMap";

export const metadata: Metadata = {
  title: "Выбери город — Санья Гид",
  description:
    "Интерактивная карта городов курса: Санья уже открыта, Пекин, Шанхай и другие города — скоро. Покупатели курса получат все города бесплатно.",
};

export default async function MapPage() {
  const cities = await getCities();
  const activeCities = cities.filter((city) => city.status === "active");
  const soonCities = cities.filter((city) => city.status !== "active");

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-milk">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(214,61,124,.05)_1.2px,transparent_1.2px)] [background-size:22px_22px]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A82E60]">
              Карта курса
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-[1.08] md:text-5xl">
              Выбери <span className="text-deep">город</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Начинаем с Саньи — остальные города откроются позже и будут
              бесплатны для покупателей курса.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-8 md:mt-14 lg:grid-cols-[2fr_1fr]">
            <div>
              <ChinaMap />

              {/* Активный город — открытка с фотографией */}
              <Link
                href="/city/sanya"
                className="group relative mt-8 block rotate-[-1deg] rounded-[10px] bg-card p-2.5 pb-3 shadow-[0_16px_36px_rgba(74,44,42,.13)] transition-transform duration-300 ease-out hover:rotate-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-1 bg-butter/70 shadow-sm"
                />
                <span className="relative block aspect-[16/6] overflow-hidden rounded-[6px] bg-skySoft sm:aspect-[16/5]">
                  <Image
                    src="/images/photos/palm-beach-walk.webp"
                    alt="Пальма и песчаный берег Саньи — фотография Сабины"
                    fill
                    sizes="(max-width: 1024px) 92vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-choco/55 to-transparent" />
                  <span className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                    <span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-milk/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-deep shadow-sm backdrop-blur-sm">
                        <IconPalm size={13} /> открыто
                      </span>
                      <span className="mt-1.5 block font-display text-lg font-bold text-milk drop-shadow sm:text-2xl">
                        Санья · Хайнань
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-milk/90 px-3.5 py-2 text-xs font-bold text-deep shadow-sm backdrop-blur-sm transition-transform duration-200 group-hover:translate-x-0.5 sm:text-sm">
                      Смотреть места <IconArrowRight size={16} />
                    </span>
                  </span>
                </span>
              </Link>
            </div>

            {/* Города курса — дневниковый список */}
            <aside className="relative rounded-card border border-blush bg-milk p-5 shadow-lift md:p-6">
              <span
                aria-hidden="true"
                className="absolute -top-3 right-8 h-6 w-20 rotate-6 bg-pastel/90 shadow-sm"
              />
              <div className="rounded-[18px] border border-dashed border-choco/20 p-4 md:p-5">
                <h2 className="font-display text-lg font-bold text-ink">
                  Города курса
                </h2>

                {activeCities.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {activeCities.map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/city/${city.slug}`}
                          className="flex min-h-[44px] items-center justify-between gap-2 rounded-2xl bg-pastel px-4 py-2 font-semibold text-deep shadow-sm transition-colors hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep"
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
                    ))}
                  </ul>
                )}

                {soonCities.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {soonCities.map((city) => (
                      <li
                        key={city.slug}
                        className="flex min-h-[44px] items-center justify-between gap-2 rounded-2xl border border-dashed border-choco/15 px-4 py-2 text-muted"
                      >
                        <span className="inline-flex items-center gap-2">
                          <IconLock size={16} />
                          {city.name}
                        </span>
                        <span className="rounded-full bg-blush px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-deep">
                          Скоро
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-4 flex items-start gap-2 border-t border-dashed border-choco/15 pt-4 text-sm leading-snug text-muted">
                  <IconGift size={18} className="mt-0.5 shrink-0 text-deep" />
                  Все будущие города — бесплатно для покупателей курса.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <FreemiumBar />
    </>
  );
}
