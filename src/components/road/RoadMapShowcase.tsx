import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  IconArrowRight,
  IconChecklist,
  IconLock,
  IconPhone,
  IconPin,
} from "@/components/icons";

const advantages = [
  {
    icon: IconPin,
    title: "Не просто точка на карте",
    text: "Русское и китайское названия, описание и подсказки из поездки.",
    tint: "bg-pastel/70",
  },
  {
    icon: IconChecklist,
    title: "Всё нужное перед выходом",
    text: "Как добраться, сколько стоит и на что обратить внимание.",
    tint: "bg-butterSoft",
  },
  {
    icon: IconPhone,
    title: "Удобно открыть уже на месте",
    text: "С телефона — когда нужно показать адрес или выбрать, куда поехать.",
    tint: "bg-skySoft",
  },
];

function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-7 w-24 bg-[#EAC778]/55 shadow-sm backdrop-blur-[1px] ${className}`}
    />
  );
}

function MapSketch() {
  return (
    <svg
      viewBox="0 0 600 450"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect width="600" height="450" fill="#E1EEF9" />
      <g fill="none" stroke="#7FB3E0" strokeWidth="2" opacity="0.32">
        <path d="M-20 55c90 28 142-26 232 2s166-20 274 3 142-8 160-2" />
        <path d="M-30 365c92-30 164 29 257-3s164 27 264-2 145 12 160 5" />
        <path d="M35 0c18 106-25 218 5 450M548 0c-24 112 31 235-4 450" />
      </g>
      <g transform="translate(5 100) scale(0.4)">
        <path
          d="M453 63 438 64 426 48 415 55 418 73 388 56 371 58 353 75 347 66 305 69 304 81 275 75 264 88 278 86 279 95Q244 107 216 128Q190 148 199 177Q199 203 213 218Q237 237 264 240L294 240 307 252 325 245 317 242 327 229Q344 232 358 230L369 210Q391 203 409 189L407 180 398 184Q421 155 424 142L438 105 447 105 445 113 464 102Q464 82 453 63Z"
          fill="#EBF3E0"
          stroke="#96B482"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M265 106c40-11 75 4 125-14M229 160c51-20 94-10 156 18M275 220c35-26 72-25 107-36M307 82c-12 48 18 88 9 148"
          fill="none"
          stroke="#B7C99F"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M390 73c10 35-5 62-22 85s-20 40-49 69"
          fill="none"
          stroke="#D63D7C"
          strokeWidth="4"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
        <circle cx="390" cy="73" r="6" fill="#7FB3E0" stroke="#FFFBF3" strokeWidth="3" />
        <path
          d="M319 192c-12 0-21 9-21 20 0 16 21 31 21 31s21-15 21-31c0-11-9-20-21-20Z"
          fill="#D63D7C"
          stroke="#FFFBF3"
          strokeWidth="3"
        />
        <circle cx="319" cy="212" r="6" fill="#FFFBF3" />
      </g>
      <g fill="#4A2C2A" fontFamily="sans-serif">
        <text x="95" y="88" fontSize="14" fontWeight="700" letterSpacing="2">
          ХАЙНАНЬ
        </text>
        <text x="150" y="258" fontSize="14" fontWeight="700">
          САНЬЯ
        </text>
        <text x="165" y="132" fontSize="10">
          ХАЙКОУ
        </text>
      </g>
      <g transform="translate(78 305)" stroke="#B78358" fill="none" strokeWidth="2.5" opacity="0.8">
        <circle r="28" />
        <path d="M0-38V38M-38 0H38" />
        <path d="m0-26 8 26-8 26-8-26Z" fill="#F2CE6B" />
        <text x="-5" y="-45" fill="#4A2C2A" stroke="none" fontSize="14" fontWeight="700">
          N
        </text>
      </g>
      <g fill="#477E99" fontFamily="sans-serif" fontSize="11" fontWeight="700" letterSpacing="2" opacity="0.7">
        <text x="42" y="400">ЮЖНО-КИТАЙСКОЕ МОРЕ</text>
      </g>
    </svg>
  );
}

export default function RoadMapShowcase() {
  return (
    <section id="map" className="relative overflow-hidden bg-blush/45 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(90deg,rgba(84,54,47,.11)_1px,transparent_1px),linear-gradient(rgba(84,54,47,.09)_1px,transparent_1px)] [background-size:5px_5px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-skySoft/65 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <Reveal>
          <div className="max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A82E60]">
              Карта Саньи · всегда с собой
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-ink md:text-5xl">
              Загляни <span className="text-deep">на карту</span>
            </h2>
            <p className="mt-5 leading-relaxed text-choco/70">
              Не подборка обезличенных меток, а места, которые Сабина проверила сама. Открывай карту с телефона и решай, куда поехать, прямо в поездке.
            </p>

            <ul className="mt-8 space-y-3.5">
              {advantages.map((item) => (
                <li
                  key={item.title}
                  className={`flex gap-3.5 rounded-2xl border border-white/70 p-4 shadow-soft ${item.tint}`}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-milk text-deep shadow-sm">
                    <item.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-choco/70">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/city/sanya"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#B83A6B] px-5 py-3 text-sm font-semibold text-milk shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#9F2F5B] hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep"
            >
              Открыть карту Саньи <IconArrowRight size={18} />
            </Link>
            <p className="mt-3 text-xs font-semibold text-choco/70">
              Часть мест открыта бесплатно — их можно посмотреть сейчас.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative mx-auto w-full max-w-[660px] px-2 pb-3 pt-5 sm:px-8 lg:h-[620px] lg:px-0 lg:pb-0 lg:pt-0">
            <div className="absolute left-0 top-0 w-full -rotate-[3deg] rounded-[6px] bg-skySoft shadow-[0_18px_35px_rgba(74,44,42,.1)] sm:w-[96%] lg:-left-[4%] lg:top-12 lg:w-[104%]">
              <div className="aspect-[4/3] overflow-hidden rounded-[5px] border border-choco/10">
                <MapSketch />
              </div>
              <span aria-hidden="true" className="absolute left-1/3 top-0 h-full w-px bg-choco/10" />
              <span aria-hidden="true" className="absolute left-2/3 top-0 h-full w-px bg-choco/10" />
            </div>

            <figure className="relative z-10 ml-auto mt-[210px] w-[84%] rotate-[2.5deg] rounded-[5px] bg-milk p-2.5 pb-4 shadow-[0_22px_45px_rgba(74,44,42,.15)] sm:mt-[240px] sm:w-[78%] sm:p-3 sm:pb-5 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[70%]">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
              <div className="relative aspect-[4/4.15] overflow-hidden rounded-[2px] bg-skySoft">
                <Image
                  src="/images/photos/palm-beach-walk.webp"
                  alt="Пальма, песчаный берег и спокойное море — фотография Сабины"
                  fill
                  sizes="(max-width: 1024px) 72vw, 34vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-milk/90 px-3 py-1.5 font-narrow text-[10px] font-bold uppercase tracking-[0.12em] text-choco shadow-sm backdrop-blur-sm">
                  Санья · Хайнань
                </span>
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 px-1 font-narrow text-[9px] font-bold uppercase tracking-[0.08em] text-choco/70 sm:text-[10px]">
                <span>Любимые места · личные находки</span>
                <span className="shrink-0 text-deep">сохранить в поездку</span>
              </figcaption>
            </figure>

            <Link
              href="/place/dadonghai"
              className="group relative z-20 -mt-14 block w-[66%] -rotate-[3deg] rounded-[4px] border border-choco/10 bg-milk p-4 shadow-[0_16px_32px_rgba(74,44,42,.16)] transition duration-200 ease-out hover:-translate-y-1 hover:rotate-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep sm:p-5 lg:absolute lg:bottom-[102px] lg:left-0 lg:mt-0 lg:w-[46%]"
            >
              <span className="font-narrow text-[10px] font-bold uppercase tracking-[0.16em] text-[#A82E60]">
                Бесплатный пример
              </span>
              <span className="mt-2 flex items-start justify-between gap-2">
                <span>
                  <span className="block font-display text-lg font-bold leading-tight text-ink sm:text-xl">
                    Пляж Дадунхай
                  </span>
                  <span className="mt-1 block font-sans text-sm font-semibold text-choco/70">大东海</span>
                </span>
                <IconArrowRight
                  size={21}
                  className="mt-1 shrink-0 text-deep transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
              <span className="mt-3 block border-t border-dashed border-choco/20 pt-3 text-xs leading-relaxed text-choco/70">
                Пальмы, кафе у воды и море в пяти минутах от отеля.
              </span>
            </Link>

            <aside className="relative z-20 ml-auto -mt-4 w-[64%] rotate-[2deg] border border-dashed border-choco/20 bg-butterSoft p-4 shadow-[0_12px_28px_rgba(74,44,42,.11)] sm:p-5 lg:absolute lg:bottom-[8px] lg:right-[1%] lg:mt-0 lg:w-[50%]">
              <div className="flex items-center gap-2 text-[#A82E60]">
                <IconLock size={18} className="shrink-0" />
                <p className="font-narrow text-[10px] font-bold uppercase tracking-[0.14em]">
                  В полной версии
                </p>
              </div>
              <h3 className="mt-2 font-display text-lg font-bold leading-tight text-ink sm:text-xl">
                Пляж Хайтанвань
              </h3>
              <p className="mt-1 font-sans text-sm font-semibold text-choco/70">海棠湾</p>
              <p className="mt-3 border-t border-choco/15 pt-3 text-xs leading-relaxed text-choco/70">
                Тихий залив, бесплатный вход и лучшие фотоспоты без толпы.
              </p>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
