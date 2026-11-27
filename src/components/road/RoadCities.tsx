import Reveal from "@/components/Reveal";
import { IconGift } from "@/components/icons";
import { getCities } from "@/lib/data";

// Подписи к городам; если для нового города подписи нет — покажем общую фразу.
const captions: Record<string, string> = {
  beijing: "столица и Великая стена",
  shanghai: "неон и набережная Вайтань",
  guangzhou: "столица кантонской кухни",
  shenzhen: "город технопарков и парков",
  chengdu: "панды и бамбуковые рощи",
  chongqing: "горный мегаполис и хого",
  hangzhou: "чай и озеро Сиху",
  xian: "терракотовая армия",
  guilin: "карстовые горы и реки",
  harbin: "ледяной город и русский след",
};

// Четыре стиля наклеек — чередуются по кругу, дизайн не меняется.
const stickerStyles = [
  { bg: "bg-pastel", rotate: "-rotate-2", tape: "bg-butter/70" },
  { bg: "bg-skySoft", rotate: "rotate-2", tape: "bg-pastel/80" },
  { bg: "bg-butterSoft", rotate: "rotate-1", tape: "bg-sky/60" },
  { bg: "bg-pistachioSoft", rotate: "-rotate-1", tape: "bg-pastel/80" },
];

export default async function RoadCities() {
  const cities = await getCities();
  const upcomingCities = cities
    .filter((city) => city.status === "coming_soon")
    .slice(0, 4);

  if (!upcomingCities.length) return null;

  return (
    <section
      id="cities"
      className="relative overflow-hidden bg-skySoft/55 py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(214,61,124,.06)_1.2px,transparent_1.2px)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A82E60]">
            Маршрут растёт
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.08] text-ink md:text-5xl">
            Скоро <span className="text-deep">новые города</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Начинаем с Саньи — а дальше курс пополняется новыми направлениями,
            собранными так же подробно и честно.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:mt-14 lg:grid-cols-4">
          {upcomingCities.map((city, index) => {
            const style = stickerStyles[index % stickerStyles.length];
            return (
              <Reveal key={city.slug}>
                <figure
                  className={`relative h-full rounded-[10px] p-3 pb-4 shadow-[0_14px_30px_rgba(74,44,42,.12)] transition-transform duration-300 ease-out hover:rotate-0 motion-reduce:transition-none ${style.bg} ${style.rotate}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-1 shadow-sm ${style.tape}`}
                  />
                  <div className="flex h-full flex-col items-center gap-2.5 rounded-[7px] border border-dashed border-choco/20 px-3 pb-4 pt-6 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-milk text-2xl shadow-sm">
                      {city.emoji}
                    </span>
                    <h3 className="font-display text-lg font-bold leading-tight text-ink md:text-xl">
                      {city.name}
                    </h3>
                    <p className="text-xs leading-snug text-choco/65">
                      {captions[city.slug] ?? "новое направление курса"}
                    </p>
                    <span className="mt-auto rounded-full bg-milk/85 px-3 py-1 font-narrow text-[10px] font-bold uppercase tracking-[0.14em] text-deep shadow-sm">
                      Скоро
                    </span>
                  </div>
                </figure>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-3 rounded-[20px] border border-dashed border-choco/20 bg-milk/85 px-5 py-4 text-center shadow-soft md:mt-14">
            <IconGift size={22} className="shrink-0 text-deep" />
            <p className="text-sm font-semibold leading-snug text-choco/80">
              Все новые города покупатели курса получают бесплатно — доступ
              остаётся навсегда.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
