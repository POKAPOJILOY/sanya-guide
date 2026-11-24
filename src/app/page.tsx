import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import LockedCard from "@/components/ui/LockedCard";
import PandaHero from "@/components/panda/PandaHero";
import Reveal from "@/components/Reveal";
import { categories } from "@/data/places";
import {
  IconBeach,
  IconCamera,
  IconChecklist,
  IconCity,
  IconFlower,
  IconIsland,
  IconMap,
  IconPalm,
  IconPhone,
  IconPin,
  IconWave,
  CategoryIcon,
  type IconProps,
} from "@/components/icons";

const inside: { icon: (p: IconProps) => React.ReactNode; title: string; text: string }[] = [
  {
    icon: IconMap,
    title: "Интерактивная карта",
    text: "Все места на одной карте: пляжи, кафе, рынки и аптеки. Открывается с телефона прямо в поездке.",
  },
  {
    icon: IconPhone,
    title: "Приложения и оплата",
    text: "Пошагово настраиваем Alipay и WeChat, VPN и карты — чтобы всё работало ещё до вылета.",
  },
  {
    icon: IconPin,
    title: "Места от локалов",
    text: "Не туристические ловушки, а места, которые любят сами китайцы: еда, массажи, секретные пляжи.",
  },
  {
    icon: IconChecklist,
    title: "Чек-листы",
    text: "Что взять, что скачать, что распечатать. Готовые списки — просто отмечай галочки.",
  },
];

const places: { icon: (p: IconProps) => React.ReactNode; name: string; text: string }[] = [
  {
    icon: IconBeach,
    name: "Пляж Дадунхай",
    text: "Городской пляж с пальмами, кафе у воды и самым удобным районом для жизни.",
  },
  {
    icon: IconIsland,
    name: "Остров Вузичжоу",
    text: "Бирюзовая вода и белый песок — «Мальдивы Китая» в получасе от города.",
  },
];

const cities = ["Пекин", "Шанхай", "Гуанчжоу", "Чэнду"];

const faq = [
  {
    q: "А если я никогда не была в Китае?",
    a: "Курс как раз для первого раза: начинаем с установки приложений и сим-карты, идём шаг за шагом до заселения в отель. Ничего не нужно знать заранее.",
  },
  {
    q: "Чем это отличается от бесплатных гайдов?",
    a: "Всё собрано в одном месте и проверено на себе: рабочие схемы оплаты, актуальные адреса и карта, которая открывается с телефона прямо в поездке.",
  },
  {
    q: "Как я получу доступ после оплаты?",
    a: "Сразу после покупки откроется полная версия сайта: все места на карте, гайды и чек-листы. Доступ остаётся навсегда.",
  },
  {
    q: "Будут ли другие города?",
    a: "Да! Готовим Пекин, Шанхай, Гуанчжоу и Чэнду. Все покупатели курса получат новые города бесплатно.",
  },
];

const heroPhotos: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className: string;
  tape: string;
}[] = [
  {
    src: "/images/photos/sea-sunset.webp",
    width: 800,
    height: 600,
    alt: "Закат над морем на Хайнане",
    className: "left-[1%] top-[6%] hidden w-40 -rotate-3 md:block md:w-56",
    tape: "-top-3 left-1/2 -translate-x-1/2 -rotate-6",
  },
  {
    src: "/images/photos/coconut-beach.webp",
    width: 600,
    height: 800,
    alt: "Кокос с гибискусом на пляже",
    className: "bottom-[10%] left-[6%] hidden w-36 rotate-2 md:block lg:w-44",
    tape: "-top-3 left-1/2 -translate-x-1/2 rotate-3",
  },
  {
    src: "/images/photos/itasha-hotel.webp",
    width: 600,
    height: 800,
    alt: "Иташа-авто у розового отеля",
    className: "right-[2%] top-[4%] hidden w-36 rotate-3 md:block md:w-48",
    tape: "-top-3 left-1/2 -translate-x-1/2 rotate-6",
  },
  {
    src: "/images/photos/cafe-cakes.webp",
    width: 600,
    height: 800,
    alt: "Витрина кафе с тортами",
    className: "bottom-[16%] right-[30%] hidden w-36 -rotate-2 lg:block xl:w-44",
    tape: "-top-3 left-1/2 -translate-x-1/2 -rotate-3",
  },
  {
    src: "/images/photos/maneki-neko.webp",
    width: 600,
    height: 800,
    alt: "Полки с манэки-нэко",
    className: "bottom-[6%] right-[2%] hidden w-32 rotate-2 md:block lg:w-40",
    tape: "-top-3 left-1/2 -translate-x-1/2 -rotate-6",
  },
];

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Санья Гид — Хайнань: курс-путеводитель",
  description:
    "Интерактивная карта и честные гайды по Хайнаню: приложения, Alipay, WeChat и места, которые любят сами китайцы.",
  offers: {
    "@type": "Offer",
    price: "1990",
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home({
  searchParams,
}: {
  searchParams: { font?: string };
}) {
  // временно для показа Егору: ?font=ptn переключает узкий заголовок на PT Sans Narrow
  const narrowClass =
    searchParams.font === "ptn" ? "font-display-alt" : "font-narrow";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-pastel to-bg pb-28">
          {/* фото-коллаж Сабины: наклейки со скотчем */}
          {heroPhotos.map((p) => (
            <div
              key={p.src}
              aria-hidden="true"
              className={`photo-sticker absolute z-0 select-none ${p.className}`}
            >
              <span className={`tape ${p.tape}`} />
              <Image
                src={p.src}
                width={p.width}
                height={p.height}
                alt={p.alt}
                className="h-auto w-full rounded-lg object-cover"
                priority={false}
              />
            </div>
          ))}

          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 md:pt-24 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <Badge>
                <IconPalm size={14} /> Курс-путеводитель по Хайнаню
              </Badge>
              <h1
                className={`text-hero mt-6 font-bold ${narrowClass} text-outline`}
              >
                Хайнань — курс-путеводитель
              </h1>
              <p className="mx-auto mt-5 text-lg text-muted lg:mx-0">
                Интерактивная карта и интересные локации, а также: приложения,
                Alipay, WeChat, бронирование отелей и билетов, доставка, карты —
                всё для поездки в одном месте.
              </p>
              <p className="mt-3 text-xl font-semibold text-accent md:text-2xl">
                ваш гид по локальным аутентичным местам
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Button href="#">
                  Купить доступ —{" "}
                  <span className="pixel-accent">1 990 ₽</span>
                </Button>
                <Button href="/map" variant="secondary">
                  Смотреть карту
                </Button>
              </div>
              <div className="mt-10 inline-flex max-w-full items-center justify-center gap-1.5 rounded-full border border-blush bg-card px-6 py-3 text-sm font-semibold text-ink shadow-soft">
                <IconMap size={16} className="text-deep" /> Карта, гайды и
                чек-листы. Доступ навсегда.
              </div>
            </div>

            <PandaHero />
          </div>

          {/* волнистая граница в цвет следующей секции */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 z-[5] h-14 w-full text-bg md:h-20"
          >
            <path
              d="M0,44 C240,84 480,4 720,44 C960,84 1200,4 1440,44 L1440,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>
        </section>

        {/* Что внутри */}
        <section id="course" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
              Что внутри курса
            </h2>
            <p className="mx-auto mt-3 text-center text-muted">
              Всё, чтобы поездка прошла легко — от посадки в самолёт до
              последнего кокоса на пляже.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {inside.map((item) => (
              <Reveal key={item.title}>
                <Card className="h-full text-center">
                  <span className="inline-flex text-deep">
                    <item.icon size={40} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="mx-auto mt-2 text-sm text-muted">{item.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Категории мест */}
        <section id="categories" className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
              Что есть на карте
            </h2>
            <p className="mx-auto mt-3 text-center text-muted">
              Семь категорий мест — от пляжей до ночных рынков.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.id}>
                <div
                  className={`stitch relative flex h-full flex-col items-center gap-3 rounded-card border border-blush bg-card p-5 text-center shadow-soft transition-transform duration-200 hover:-translate-y-1 ${
                    i % 2 === 0 ? "-rotate-1" : "rotate-1"
                  }`}
                >
                  <span className="pattern-vichy inline-flex rounded-full p-4 text-deep">
                    <CategoryIcon id={c.id} size={32} />
                  </span>
                  <h3 className={`${narrowClass} text-lg font-bold text-ink`}>
                    {c.label}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Превью карты */}
        <section id="map" className="bg-blush/40 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
                Загляни на карту
              </h2>
              <p className="mx-auto mt-3 text-center text-muted">
                Пара мест для примера — остальные ждут в полной версии.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {places.map((place) => (
                <Reveal key={place.name}>
                  <Card className="h-full p-0">
                    <div className="flex h-40 items-center justify-center rounded-t-card bg-gradient-to-br from-pastel to-blush text-deep">
                      <place.icon size={56} />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-bold">
                        {place.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted">{place.text}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
              <Reveal>
                <LockedCard title="Секретная бухта">
                  <div className="flex h-40 items-center justify-center rounded-t-card bg-gradient-to-br from-pastel to-blush text-deep">
                    <IconWave size={56} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold">
                      Секретная бухта
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      Тихое место без туристов: как добраться, когда приходить и
                      где сделать лучшие фото на закате.
                    </p>
                  </div>
                </LockedCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Скоро новые города */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
              Скоро новые города
            </h2>
            <p className="mx-auto mt-3 text-center text-muted">
              Покупатели курса получают все будущие города бесплатно.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <Reveal key={city}>
                <Card className="flex h-full flex-col items-center gap-3 text-center">
                  <span className="inline-flex text-deep">
                    <IconCity size={40} />
                  </span>
                  <h3 className="font-display text-lg font-bold">{city}</h3>
                  <Badge>Скоро</Badge>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-blush/40 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <Reveal>
              <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
                Частые вопросы
              </h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {faq.map((item) => (
                <Reveal key={item.q}>
                  <details className="group rounded-card border border-blush bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold marker:hidden">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="text-accent transition-transform duration-200 group-open:rotate-45"
                      >
                        ＋
                      </span>
                    </summary>
                    <p className="mt-3 text-muted">{item.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Автор */}
        <section id="reviews" className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <Reveal>
            <Card className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-pastel text-white shadow-soft">
                <IconFlower size={56} />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  Привет! Я Сабина
                </h2>
                <p className="mt-3 text-muted">
                  Была на Хайнане три раза и каждый день сижу в китайских
                  соцсетях — слежу, куда ходят сами китайцы, а не туристы.
                  Собрала всё в одном месте: где менять деньги, как платить
                  телефоном и где то самое место из Сяохуншу. Без воды и
                  рекламы — только то, что работает.
                </p>
                <p className="mt-3 text-xl font-semibold text-accent">
                  обнимаю, до встречи на Хайнане!
                </p>
                <a
                  href="https://www.instagram.com/saiiko_sama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 font-semibold text-deep transition-colors hover:text-accent"
                >
                  <IconCamera size={18} /> @saiiko_sama
                </a>
              </div>
            </Card>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
