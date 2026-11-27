import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import RoadHero from "@/components/road/RoadHero";
import RoadItems from "@/components/road/RoadItems";
import RoadTransition from "@/components/road/RoadTransition";
import RoadCourse from "@/components/road/RoadCourse";
import RoadCities from "@/components/road/RoadCities";
import RoadMapShowcase from "@/components/road/RoadMapShowcase";
import RoadPhotoDiary from "@/components/road/RoadPhotoDiary";
import RoadCategoriesDiary from "@/components/road/RoadCategoriesDiary";
import SabinaFlowerAvatar from "@/components/road/SabinaFlowerAvatar";
import Reveal from "@/components/Reveal";
import { IconCamera } from "@/components/icons";

const courseSteps = [
  {
    title: "Подготовка без хаоса",
    text: "Что установить, оформить и сохранить до вылета — в правильном порядке.",
  },
  {
    title: "Оплата и связь",
    text: "Alipay, WeChat, VPN и карты с понятными скриншотами на русском.",
  },
  {
    title: "Проверенные места",
    text: "Пляжи, локальные кафе, рынки и фотолокации с адресами на китайском.",
  },
  {
    title: "Помощь прямо в поездке",
    text: "Карта и чек-листы открываются с телефона, когда они действительно нужны.",
  },
];

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

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Санья Гид — Хайнань: курс-путеводитель",
  description:
    "Интерактивная карта и честные гайды по Хайнаню: приложения, Alipay, WeChat и места, которые любят сами китайцы.",
  offers: {
    "@type": "Offer",
    price: "599",
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
  // Временный параметр только для сравнения уже одобренного узкого шрифта.
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
        {/* Первый экран: дорожное кино с Бао — текст, цена и кнопки видны сразу */}
        <RoadHero narrowClass={narrowClass} />

        {/* Связка кино → чемодан: открытие и появление предметов управляются прокруткой */}
        <RoadTransition />

        {/* Интерактивные дорожные предметы из чемодана */}
        <RoadItems />

        {/* Что внутри курса: согласованный разворот дорожного журнала */}
        <RoadCourse steps={courseSteps} />

        {/* Одобренный интерактивный разворот категорий с фотографиями Сабины. */}
        <RoadCategoriesDiary />

        {/* Одобренный показ карты с бесплатным примером и платным teaser. */}
        <RoadMapShowcase />

        {/* Пять живых фотографий из дорожного дневника Сабины. */}
        <RoadPhotoDiary />

        {/* Будущие города — наклейки на дорожном чемодане */}
        <RoadCities />

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
        <section id="reviews" className="relative overflow-hidden py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4">
            <Reveal>
              <div className="relative rounded-card border border-blush bg-milk p-5 pt-10 shadow-lift md:p-8 md:pt-12">
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-8 h-6 w-20 -rotate-6 bg-butter/70 shadow-sm"
                />
                <span
                  aria-hidden="true"
                  className="absolute -top-3 right-8 h-6 w-20 rotate-6 bg-pastel/90 shadow-sm"
                />
                <div className="flex flex-col items-center gap-6 rounded-[18px] border border-dashed border-choco/20 p-5 text-center md:flex-row md:gap-8 md:p-7 md:text-left">
                  <div className="shrink-0">
                    <SabinaFlowerAvatar />
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
                    <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                      {[
                        "3 поездки на Хайнань",
                        "каждый день в китайских соцсетях",
                        "проверено на себе",
                      ].map((fact) => (
                        <span
                          key={fact}
                          className="rounded-full bg-blush px-3 py-1 text-xs font-semibold text-deep"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xl font-semibold text-accent">
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
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
