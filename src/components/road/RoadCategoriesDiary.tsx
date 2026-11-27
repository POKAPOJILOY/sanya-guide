"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, type CategoryId } from "@/data/places";
import { CategoryIcon, IconArrowRight, IconMap } from "@/components/icons";
import Reveal from "@/components/Reveal";

const categoryNotes: Record<CategoryId, string> = {
  beaches: "Бухты, пляжи и острова — с координатами и лучшим временем для визита",
  sights: "Храмы, статуи и смотровые площадки, ради которых стоит выехать из отеля",
  food: "Кафе, морепродукты и локальная кухня: что заказать и сколько денег заложить",
  shopping: "Торговые центры, рынки и милые находки, которые хочется увезти домой",
  spa: "Массажи и спа, где можно восстановиться после перелёта и долгих прогулок",
  entertainment: "Шоу, активности и места для впечатлений, если хочется чего-то необычного",
  parks: "Тропические парки и зелёные маршруты для спокойного дня среди природы",
};

const categoryPhotos: Record<
  CategoryId,
  { src: string; alt: string; note: string; tape: string }
> = {
  beaches: {
    src: "/images/photos/palm-beach-walk.webp",
    alt: "Пальма, песчаный берег и спокойное море — фотография Сабины",
    note: "море, пальмы и неспешные прогулки",
    tape: "bg-sky/60",
  },
  sights: {
    src: "/images/photos/guanyin-statue.webp",
    alt: "Статуя Гуаньинь на Хайнане среди тропической зелени",
    note: "места, ради которых стоит выехать из отеля",
    tape: "bg-butter/70",
  },
  food: {
    src: "/images/photos/seaside-breakfast-bow.webp",
    alt: "Завтрак у моря с большим розовым бантом — фотография Сабины",
    note: "завтраки с видом и локальные вкусы",
    tape: "bg-pastel/80",
  },
  shopping: {
    src: "/images/photos/care-bears.webp",
    alt: "Яркая витрина с игрушками Care Bears",
    note: "милые находки, которые хочется увезти домой",
    tape: "bg-pastel/80",
  },
  spa: {
    src: "/images/photos/sea-sunset.webp",
    alt: "Спокойный закат над морем — время замедлиться и отдохнуть",
    note: "время выдохнуть и никуда не спешить",
    tape: "bg-sky/60",
  },
  entertainment: {
    src: "/images/photos/raccoon-friends.webp",
    alt: "Еноты на деревянной террасе — неожиданная встреча в поездке",
    note: "неожиданные знакомства и яркие впечатления",
    tape: "bg-butter/70",
  },
  parks: {
    src: "/images/photos/coconut-beach.webp",
    alt: "Кокос с цветком на фоне тропических пальм и моря",
    note: "тропическая зелень и спокойные маршруты",
    tape: "bg-pistachio/60",
  },
};

export default function RoadCategoriesDiary() {
  const [activeId, setActiveId] = useState<CategoryId>("beaches");
  const activeIndex = categories.findIndex((category) => category.id === activeId);
  const activePhoto = categoryPhotos[activeId];

  return (
    <section id="categories" className="relative overflow-hidden bg-butterSoft/40 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute -right-24 top-16 h-72 w-72 rounded-full border border-dashed border-deep/15"
      />
      <div className="relative mx-auto max-w-[1180px] px-5 md:px-8">
        <Reveal>
          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-narrow text-[11px] font-bold uppercase tracking-[0.18em] text-deep">
                карта сабины · 7 направлений
              </p>
              <h2 className="mt-3 font-display text-[2.65rem] font-bold leading-[1.04] tracking-normal text-ink md:text-5xl">
                Что есть на карте
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-choco/65 md:col-span-5 md:pb-1">
              Проверенные места Саньи, разложенные по категориям. Отмечены точки на
              интерактивной карте, которые можно открыть прямо с телефона.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col md:mt-14 md:grid md:grid-cols-12 md:items-start md:gap-x-14">
          <Reveal className="order-2 mt-6 md:order-1 md:col-span-5 md:row-span-2 md:mt-0">
            <figure className="relative mx-auto w-full max-w-[430px] md:mx-0 md:-rotate-2">
              <span
                aria-hidden="true"
                className={`absolute -top-3 left-1/2 z-20 h-7 w-24 -translate-x-1/2 rotate-2 ${activePhoto.tape} transition-colors duration-300 motion-reduce:transition-none`}
              />
              <div className="relative bg-white p-3 pb-4 shadow-[0_20px_45px_rgba(74,44,42,.13)] md:p-4 md:pb-5">
                <div
                  id="category-photo"
                  className="relative aspect-[4/3] overflow-hidden bg-pastel md:aspect-[4/4.7]"
                  aria-live="polite"
                >
                  {categories.map((category, index) => {
                    const photo = categoryPhotos[category.id];
                    const active = category.id === activeId;
                    return (
                      <Image
                        key={category.id}
                        src={photo.src}
                        alt={active ? photo.alt : ""}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 64px), 390px"
                        loading={index === 0 ? "eager" : "lazy"}
                        aria-hidden={!active}
                        className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    );
                  })}
                </div>
                <figcaption className="flex items-end justify-between gap-4 px-1 pt-4">
                  <div>
                    <p className="font-narrow text-[10px] font-bold uppercase tracking-[0.15em] text-choco/45">
                      из поездок сабины
                    </p>
                    <p key={activeId} className="mt-1 text-sm font-semibold text-choco">
                      {activePhoto.note}
                    </p>
                  </div>
                  <span className="shrink-0 font-narrow text-xs font-bold text-deep">
                    {String(activeIndex + 1).padStart(2, "0")} / 07
                  </span>
                </figcaption>
              </div>
              <span
                aria-hidden="true"
                className="absolute -bottom-4 right-5 -rotate-6 bg-pistachioSoft px-3 py-2 font-narrow text-[10px] font-bold uppercase tracking-[0.12em] text-choco/65 shadow-[0_5px_12px_rgba(74,44,42,.08)] md:-right-5"
              >
                выбирай настроение
              </span>
            </figure>
          </Reveal>

          <Reveal className="order-1 md:order-2 md:col-span-7">
            <div
              role="group"
              aria-label="Категории мест"
              className="-mx-5 flex snap-x gap-6 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:block md:snap-none md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category, index) => {
                const active = category.id === activeId;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={active}
                    aria-controls="category-photo"
                    onClick={() => setActiveId(category.id)}
                    onMouseEnter={() => setActiveId(category.id)}
                    onFocus={() => setActiveId(category.id)}
                    className={`group relative min-w-max snap-start border-b-2 py-3 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep motion-reduce:transition-none md:flex md:w-full md:items-center md:gap-5 md:border-b md:border-dashed md:px-3 md:py-[18px] ${
                      active
                        ? "border-deep text-deep md:bg-[linear-gradient(90deg,rgba(255,220,232,.72),rgba(255,220,232,0))]"
                        : "border-transparent text-choco/65 md:border-choco/15 md:hover:text-choco"
                    }`}
                  >
                    <span className="hidden w-6 shrink-0 font-narrow text-[11px] font-bold tracking-[0.08em] text-choco/35 md:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <CategoryIcon
                      id={category.id}
                      size={22}
                      className={`hidden shrink-0 md:block ${active ? "text-deep" : "text-choco/55"}`}
                    />
                    <span className="md:min-w-0 md:flex-1">
                      <span className="flex items-center gap-2 font-narrow text-lg font-bold leading-tight md:text-[22px]">
                        <CategoryIcon id={category.id} size={17} className="md:hidden" />
                        {category.label}
                      </span>
                      <span className="mt-1 hidden max-w-[440px] text-[13px] font-normal leading-relaxed text-choco/55 md:block">
                        {categoryNotes[category.id]}
                      </span>
                    </span>
                    <IconArrowRight
                      size={20}
                      className={`hidden shrink-0 transition-[transform,opacity] duration-200 motion-reduce:transition-none md:block ${
                        active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="order-3 mt-10 md:col-span-7 md:mt-7">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between md:px-3">
              <Link
                href="/map"
                className="group inline-flex items-center gap-3 rounded-full bg-deep px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(214,61,124,.18)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep motion-reduce:transform-none motion-reduce:transition-none"
              >
                <IconMap size={19} />
                Открыть всю карту
                <IconArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none group-hover:motion-reduce:transform-none" />
              </Link>
              <p className="text-xs leading-relaxed text-choco/50">
                Часть мест можно посмотреть бесплатно
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
