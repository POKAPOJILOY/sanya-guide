"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  IconArrowRight,
  IconCamera,
  IconCheck,
  IconMap,
  IconPhone,
  IconPlane,
  type IconProps,
} from "@/components/icons";

type VisualKind = "phone" | "ticket" | "suitcase" | "camera" | "cup" | "map";

type RoadItem = {
  id: string;
  object: string;
  note: string;
  title: string;
  description: string;
  bullets: string[];
  icon: (props: IconProps) => React.ReactNode;
  visual: VisualKind;
  activeClass: string;
  sceneClass: string;
  iconClass: string;
  cta: { label: string; href: string };
};

function SuitcaseIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" />
      <rect x="4" y="6" width="16" height="14" rx="3" />
      <path d="M8 9v8M16 9v8M8 21v1M16 21v1" />
    </svg>
  );
}

function CupIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 8h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M4 22h14" />
      <path d="m11 8 3-5M8 5c-1-1 1-1.5 0-3" />
    </svg>
  );
}

function TicketIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6V7Z" />
      <path d="M14 5v3M14 11v2M14 16v3M6 12h4" />
    </svg>
  );
}

const items: RoadItem[] = [
  {
    id: "phone",
    object: "Телефон",
    note: "приложения и оплата",
    title: "Всё заработает ещё до вылета",
    description: "Alipay, WeChat, VPN и карты — по шагам, со скриншотами на русском. Не разбираешься в китайских сервисах? Просто повторяй за Сабиной.",
    bullets: ["Alipay и оплата телефоном", "WeChat, VPN и карты", "Проверка перед вылетом"],
    icon: IconPhone,
    visual: "phone",
    activeClass: "bg-skySoft",
    sceneClass: "bg-skySoft",
    iconClass: "text-[#477E99]",
    cta: { label: "Посмотреть программу", href: "#course" },
  },
  {
    id: "ticket",
    object: "Билет",
    note: "транспорт и отели",
    title: "От посадки до заселения — без паники",
    description: "Разобрали весь путь: что делать в аэропорту, как заказать такси, забронировать отель и показать адрес водителю на китайском.",
    bullets: ["Дорога из аэропорта", "Отели и билеты", "Адреса для такси"],
    icon: TicketIcon,
    visual: "ticket",
    activeClass: "bg-butterSoft",
    sceneClass: "bg-butterSoft",
    iconClass: "text-[#8A6925]",
    cta: { label: "Что ещё внутри", href: "#course" },
  },
  {
    id: "suitcase",
    object: "Чемодан",
    note: "чек-листы",
    title: "Собрать всё и ничего не забыть",
    description: "Готовые списки вместо десяти заметок в телефоне: документы, приложения, вещи и дела на последнюю неделю перед поездкой.",
    bullets: ["Неделя до вылета", "Документы и связь", "Первый вечер в Санье"],
    icon: SuitcaseIcon,
    visual: "suitcase",
    activeClass: "bg-pistachioSoft",
    sceneClass: "bg-pistachioSoft",
    iconClass: "text-[#5F7D49]",
    cta: { label: "К программе курса", href: "#course" },
  },
  {
    id: "camera",
    object: "Камера",
    note: "места от локалов",
    title: "Не только пляжи из рекламных буклетов",
    description: "Сабина сохранила необычные фотолокации, кафе и места, которыми делятся сами китайцы. С адресами, ориентирами и советом, когда приходить.",
    bullets: ["Точки для фотографий", "Места из Сяохуншу", "Как добраться и когда идти"],
    icon: IconCamera,
    visual: "camera",
    activeClass: "bg-blush",
    sceneClass: "bg-blush",
    iconClass: "text-deep",
    cta: { label: "Заглянуть на карту", href: "/map" },
  },
  {
    id: "cup",
    object: "Чашка",
    note: "еда и кафе",
    title: "Где завтракать и что попробовать",
    description: "Локальные кафе, десерты, ночные рынки и места без туристического меню. Названия блюд и адреса можно просто показать на китайском.",
    bullets: ["Кафе и красивые десерты", "Ночные рынки", "Цены и названия блюд"],
    icon: CupIcon,
    visual: "cup",
    activeClass: "bg-butterSoft",
    sceneClass: "bg-butterSoft",
    iconClass: "text-[#8A6925]",
    cta: { label: "Найти вкусные места", href: "/map" },
  },
  {
    id: "map",
    object: "Карта",
    note: "весь Хайнань под рукой",
    title: "Любимые места Сабины — рядом с тобой",
    description: "Пляжи, кафе, рынки, аптеки и секретные бухты на одной интерактивной карте. Открывается с телефона прямо во время прогулки.",
    bullets: ["Семь понятных категорий", "Описание каждого места", "Новые города в доступе"],
    icon: IconMap,
    visual: "map",
    activeClass: "bg-skySoft",
    sceneClass: "bg-skySoft",
    iconClass: "text-[#477E99]",
    cta: { label: "Открыть карту", href: "/map" },
  },
];

function FabricTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.22]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(74,44,42,.08) 1px, transparent 1px), linear-gradient(rgba(74,44,42,.06) 1px, transparent 1px)",
        backgroundSize: "5px 5px",
        mixBlendMode: "soft-light",
      }}
    />
  );
}

function Scene({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden px-4 pb-5 pt-10 sm:px-8 ${className}`}>
      <FabricTexture />
      <div aria-hidden="true" className="absolute left-[7%] top-[18%] h-16 w-16 rounded-full bg-milk/45 blur-xl" />
      <div aria-hidden="true" className="absolute bottom-[8%] right-[6%] h-24 w-24 rounded-full bg-milk/40 blur-2xl" />
      {children}
    </div>
  );
}

function PaperPhoto({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  return (
    <figure className={`absolute w-[98px] rounded-[7px] bg-milk p-1.5 pb-5 shadow-[0_12px_24px_rgba(74,44,42,0.18)] sm:w-[118px] ${className}`}>
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-5 w-12 -translate-x-1/2 rotate-2 bg-pastel/80 shadow-sm" />
      <div className="relative aspect-[4/4.4] overflow-hidden rounded-[3px] bg-pastel">
        <Image src={src} alt={alt} fill sizes="118px" className="object-cover" />
      </div>
      <figcaption className="absolute inset-x-1 bottom-1 text-center font-narrow text-[9px] font-bold text-choco sm:text-[10px]">{label}</figcaption>
    </figure>
  );
}

function PhoneScene() {
  return (
    <Scene>
      <div className="relative -translate-y-1 -rotate-[5deg]">
        <div className="relative h-[232px] w-[142px] rounded-[28px] border-[5px] border-[#7898A3] bg-[#A9CBD5] p-[6px] shadow-[0_10px_0_#6F8F99,0_22px_30px_rgba(74,44,42,0.2)] sm:h-[260px] sm:w-[150px]">
          <div className="relative h-full overflow-hidden rounded-[19px] bg-[#52646B] px-3 pb-3 pt-4 text-milk shadow-[inset_0_0_0_2px_rgba(255,255,255,.13)]">
            <span className="mx-auto block h-1.5 w-10 rounded-full bg-[#34474E]" />
            <p className="mt-4 font-narrow text-[15px] font-bold leading-tight sm:text-[17px]">Перед поездкой</p>
            <div className="mt-3 space-y-2">
              {["Alipay", "WeChat", "VPN и карты"].map((label) => (
                <div key={label} className="flex items-center gap-1.5 rounded-lg bg-[#FFF9ED] px-2 py-2 text-[9px] font-bold text-choco shadow-[0_3px_0_rgba(41,51,53,.18)] sm:text-[10px]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pistachioSoft text-[#5F7D49]"><IconCheck size={11} /></span>
                  {label}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[7px] font-bold uppercase tracking-[0.17em] text-white/65">готово к вылету</p>
          </div>
          <span className="absolute -bottom-[15px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-[#7898A3] bg-butter" />
        </div>
        <div className="absolute -right-[74px] top-[46px] rotate-[9deg] rounded-[5px] bg-butterSoft px-3 py-2 font-narrow text-[10px] font-bold text-choco shadow-[0_7px_14px_rgba(74,44,42,.14)]">
          ВСЁ<br />РАБОТАЕТ ✓
        </div>
      </div>
      <Image src="/images/decor/flower-cookie.png" alt="" width={72} height={72} className="absolute bottom-[7%] right-[9%] w-12 rotate-12 drop-shadow-md sm:w-16" />
    </Scene>
  );
}

function TicketScene() {
  return (
    <Scene>
      <div className="relative w-full max-w-[470px] -rotate-[3deg]">
        <span aria-hidden="true" className="absolute -top-3 left-[16%] z-10 h-7 w-24 rotate-[-4deg] bg-pastel/75 shadow-sm" />
        <div className="relative grid grid-cols-[58px_1fr_74px] overflow-hidden rounded-[16px] bg-milk shadow-[0_12px_0_rgba(168,132,42,.12),0_24px_35px_rgba(74,44,42,.18)] sm:grid-cols-[72px_1fr_92px]">
          <div className="flex flex-col items-center justify-between bg-[#7EA9AF] px-2 py-5 text-milk">
            <IconPlane size={28} className="-rotate-45" />
            <span className="[writing-mode:vertical-rl] rotate-180 font-narrow text-[11px] font-bold tracking-[0.18em]">BAO AIR · SYX</span>
            <span className="h-2 w-2 rounded-full bg-butterSoft/70" />
          </div>
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-choco/55 sm:text-[9px]">Посадочный талон</p>
                <p className="mt-2 font-narrow text-2xl font-bold leading-none text-choco sm:text-4xl">САНЬЯ</p>
                <p className="mt-1 text-[8px] font-semibold text-choco/60 sm:text-[10px]">ХАЙНАНЬ · КИТАЙ</p>
              </div>
              <span className="font-narrow text-xl font-bold text-deep/60 sm:text-3xl">SYX</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dashed border-choco/20 pt-3 text-[8px] sm:text-[10px]">
              <div><p className="text-choco/50">ПАССАЖИР</p><p className="mt-1 font-bold text-choco">SABINA</p></div>
              <div><p className="text-choco/50">РЕЙС</p><p className="mt-1 font-bold text-choco">BAO 599</p></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between border-l border-dashed border-choco/25 bg-pastel/45 px-2 py-5">
            <span className="font-narrow text-[10px] font-bold text-deep">01 / 06</span>
            <span className="h-16 w-8 bg-[repeating-linear-gradient(90deg,#4A2C2A_0_2px,transparent_2px_4px)] opacity-65 sm:h-20 sm:w-10" />
            <span className="text-[7px] font-bold uppercase tracking-wider text-choco/55">HAINAN</span>
          </div>
        </div>
        <div className="absolute -bottom-5 right-7 rotate-[8deg] rounded-[6px] border-2 border-milk bg-pistachio px-4 py-2 font-narrow text-xs font-bold text-choco shadow-md">МОРЕ ЖДЁТ</div>
      </div>
    </Scene>
  );
}

function SuitcaseScene() {
  return (
    <Scene>
      <div className="relative mt-5 h-[220px] w-[310px] sm:h-[245px] sm:w-[360px]">
        <div className="absolute left-1/2 top-0 h-[116px] w-[272px] -translate-x-1/2 rounded-[28px] border-[7px] border-[#D1AA58] bg-[#E8C876] shadow-[inset_0_0_0_3px_rgba(255,249,237,.35)] sm:w-[310px]">
          <div className="absolute inset-[10px] rounded-[17px] border border-dashed border-[#B78358]/55 bg-[#FFF0CF] shadow-[inset_0_8px_18px_rgba(138,105,37,.09)]" />
          <span className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-t-xl border-[5px] border-b-0 border-choco/80" />
        </div>
        <div className="absolute bottom-5 left-1/2 h-[132px] w-[292px] -translate-x-1/2 rounded-[24px] bg-[#E4BD64] shadow-[0_12px_0_#C89D4F,0_22px_28px_rgba(74,44,42,.18)] sm:w-[330px]">
          <div className="absolute inset-x-[14px] top-[10px] h-[68px] rounded-[15px] border-[5px] border-[#C79B4D] bg-[#B98C48] shadow-[inset_0_8px_12px_rgba(84,54,47,.2)]">
            <div className="absolute inset-[7px] rounded-[8px] bg-[#F5DDA1] shadow-[inset_0_5px_8px_rgba(138,105,37,.18)]" />
          </div>
          <div className="absolute inset-x-5 bottom-3 top-[82px] rounded-[10px] border border-dashed border-milk/65" />
          <span className="absolute bottom-[-9px] left-8 h-4 w-8 rounded-b-xl bg-choco" />
          <span className="absolute bottom-[-9px] right-8 h-4 w-8 rounded-b-xl bg-choco" />
          <span className="absolute bottom-[19px] left-1/2 h-5 w-20 -translate-x-1/2 rounded-lg border-[5px] border-[#8C5A3D] bg-choco/80" />
          <span className="absolute bottom-2 left-3 h-12 w-5 rounded-md bg-[#B78358]" />
          <span className="absolute bottom-2 right-3 h-12 w-5 rounded-md bg-[#B78358]" />
        </div>
        <div className="absolute left-1/2 top-[92px] w-[190px] -translate-x-1/2 rotate-[-3deg] rounded-[8px] bg-milk px-4 py-3 shadow-[0_8px_15px_rgba(74,44,42,.18)] sm:top-[96px] sm:w-[210px]">
          <p className="font-narrow text-xs font-bold text-choco">Чемодан Бао · всё собрано</p>
          <div className="mt-2 space-y-1.5">
            {["Документы", "Приложения и связь", "Любимый шарф"].map((label) => (
              <div key={label} className="flex items-center gap-2 text-[8px] font-semibold text-choco/75 sm:text-[9px]">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-pistachioSoft text-[#5F7D49]"><IconCheck size={10} /></span>{label}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-1 rotate-[10deg] rounded-[7px] border-2 border-milk bg-pastel px-3 py-4 text-center font-narrow text-[9px] font-bold text-deep shadow-md">BAO<br />SYX</div>
      </div>
    </Scene>
  );
}

function CameraScene() {
  return (
    <Scene>
      <div className="relative h-[245px] w-[320px] sm:h-[260px] sm:w-[430px]">
        <div className="absolute left-[5px] top-[38px] h-[156px] w-[230px] -rotate-[4deg] rounded-[31px] border border-choco/10 bg-[#FFF9ED] shadow-[0_10px_0_#E7D7CB,0_22px_30px_rgba(74,44,42,.18)] sm:left-[22px] sm:top-[30px] sm:h-[174px] sm:w-[270px]">
          <div className="absolute -top-5 left-7 h-9 w-24 rounded-t-[15px] bg-choco" />
          <span className="absolute -top-7 left-12 h-4 w-8 rounded-t-md bg-[#B78358]" />
          <span className="absolute left-5 top-5 h-6 w-9 rounded-full bg-pastel shadow-[inset_0_2px_3px_rgba(74,44,42,.12)]" />
          <span className="absolute right-5 top-5 h-8 w-12 rounded-lg border-[5px] border-choco bg-skySoft" />
          <span className="absolute bottom-5 left-6 h-5 w-12 rounded-md bg-butterSoft shadow-[inset_0_2px_3px_rgba(74,44,42,.08)]" />
          <div className="absolute left-1/2 top-1/2 h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-choco bg-[#EAC778] shadow-[0_5px_0_rgba(84,54,47,.25)] sm:h-[134px] sm:w-[134px]">
            <div className="absolute inset-[14px] rounded-full border-[5px] border-[#54362F] bg-[#83B7C7] shadow-[inset_0_0_0_5px_#D9EDF0]">
              <div className="absolute inset-[13px] rounded-full bg-[#344E57] shadow-[inset_5px_5px_8px_rgba(0,0,0,.28)]" />
              <span className="absolute left-[22px] top-[12px] h-5 w-8 rotate-[-28deg] rounded-full bg-white/65 blur-[1px]" />
            </div>
          </div>
        </div>
        <PaperPhoto src="/images/photos/itasha-car.webp" alt="Яркое иташа-авто на улице Саньи" label="место из дневника" className="bottom-[2px] right-[2px] rotate-[8deg] sm:right-[4px]" />
        <Image src="/images/decor/flower-button.png" alt="" width={64} height={64} className="absolute bottom-[5px] left-[10px] w-11 -rotate-12 drop-shadow-md sm:left-[22px] sm:w-14" />
      </div>
    </Scene>
  );
}

function CupScene() {
  return (
    <Scene>
      <div className="relative h-[245px] w-[320px] sm:h-[260px] sm:w-[430px]">
        <div className="absolute bottom-[25px] left-[18px] h-[190px] w-[210px] sm:left-[30px] sm:w-[230px]">
          <span aria-hidden="true" className="absolute left-[65px] top-[3px] h-10 w-3 -rotate-6 rounded-full border-l-[3px] border-choco/20" />
          <span aria-hidden="true" className="absolute left-[105px] top-[-8px] h-12 w-3 rotate-6 rounded-full border-l-[3px] border-choco/20" />
          <div className="absolute bottom-0 left-1/2 h-[34px] w-[205px] -translate-x-1/2 rounded-[50%] bg-[#EFB3C5] shadow-[0_8px_0_#D99AAF,0_15px_24px_rgba(74,44,42,.16)]">
            <div className="absolute inset-x-5 top-2 h-3 rounded-[50%] bg-pastel" />
          </div>
          <div className="absolute bottom-[20px] left-[24px] h-[132px] w-[132px] rounded-b-[42px] rounded-t-[18px] bg-[#FFF9ED] shadow-[inset_-10px_-4px_0_#EEE4D8,0_8px_12px_rgba(74,44,42,.12)]">
            <div className="absolute left-0 top-0 h-[29px] w-[132px] rounded-[50%] border-[4px] border-[#E7D7CB] bg-[#54362F] shadow-[inset_0_4px_5px_rgba(0,0,0,.22)]">
              <span className="absolute left-5 top-2 h-2 w-16 rounded-[50%] bg-[#B78358]/65" />
            </div>
            <svg viewBox="0 0 40 36" className="absolute left-1/2 top-[58px] w-8 -translate-x-1/2 text-[#EFB3C5]" aria-hidden="true"><path d="M20 33C15 27 3 19 3 10 3 1 15-2 20 6 25-2 37 1 37 10c0 9-12 17-17 23Z" fill="currentColor" /><path d="m14 15 6 7 6-7" fill="none" stroke="#FFF9ED" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <div className="absolute bottom-[43px] left-[143px] h-[76px] w-[62px] rounded-[45%] border-[13px] border-[#FFF9ED] border-l-0 shadow-[5px_5px_0_#E7D7CB]" />
        </div>
        <PaperPhoto src="/images/photos/cafe-cakes.webp" alt="Витрина локального кафе с десертами" label="завтрак в Санье" className="right-[2px] top-[25px] rotate-[7deg] sm:right-[5px]" />
        <span className="absolute bottom-[9px] right-[20px] -rotate-6 font-narrow text-[10px] font-bold text-choco/55 sm:right-[35px]">save room for dessert</span>
      </div>
    </Scene>
  );
}

function MapScene() {
  return (
    <Scene>
      <div className="relative h-[240px] w-[330px] sm:h-[260px] sm:w-[440px]">
        <div className="absolute left-1/2 top-[22px] h-[190px] w-[310px] -translate-x-1/2 rotate-[3deg] rounded-[8px] bg-milk shadow-[0_12px_0_rgba(71,126,153,.1),0_22px_30px_rgba(74,44,42,.16)] sm:h-[210px] sm:w-[390px]">
          <svg viewBox="0 0 600 320" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="map-paper" x1="0" x2="1"><stop stopColor="#FFF9ED"/><stop offset=".5" stopColor="#F4F2DF"/><stop offset="1" stopColor="#FFF9ED"/></linearGradient>
            </defs>
            <rect width="600" height="320" fill="url(#map-paper)" />
            <g fill="none" stroke="#B9C9B0" strokeWidth="2" opacity=".45">
              <path d="M0 52c110 35 155-38 266 3s195-23 334 4" /><path d="M0 256c102-35 191 34 300-3s192 32 300-2" />
              <path d="M54 0c22 93-31 183 8 320M523 0c-29 91 38 197-5 320" />
            </g>
            <path d="M453 63 438 64 426 48 415 55 418 73 388 56 371 58 353 75 347 66 305 69 304 81 275 75 264 88 278 86 279 95Q244 107 216 128Q190 148 199 177Q199 203 213 218Q237 237 264 240L294 240 307 252 325 245 317 242 327 229Q344 232 358 230L369 210Q391 203 409 189L407 180 398 184Q421 155 424 142L438 105 447 105 445 113 464 102Q464 82 453 63Z" fill="#DDE7C8" stroke="#96B482" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M265 106c40-11 75 4 125-14M229 160c51-20 94-10 156 18M275 220c35-26 72-25 107-36M307 82c-12 48 18 88 9 148" fill="none" stroke="#B7C99F" strokeWidth="3" strokeLinecap="round" />
            <path d="M390 73c10 35-5 62-22 85s-20 40-49 69" fill="none" stroke="#D63D7C" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />
            <circle cx="390" cy="73" r="6" fill="#7FB3E0" stroke="#FFF9ED" strokeWidth="3" />
            <path d="M319 192c-12 0-21 9-21 20 0 16 21 31 21 31s21-15 21-31c0-11-9-20-21-20Z" fill="#D63D7C" stroke="#FFF9ED" strokeWidth="3" /><circle cx="319" cy="212" r="6" fill="#FFF9ED" />
            <g fill="#54362F" fontFamily="sans-serif"><text x="273" y="30" fontSize="18" fontWeight="700" letterSpacing="3">ХАЙНАНЬ</text><text x="334" y="271" fontSize="18" fontWeight="700">САНЬЯ</text><text x="401" y="65" fontSize="12">ХАЙКОУ</text></g>
            <g transform="translate(78 68)" stroke="#B78358" fill="none" strokeWidth="3"><circle r="31" /><path d="M0-42V42M-42 0H42" /><path d="m0-29 9 29-9 29-9-29Z" fill="#EAC778" /><text x="-6" y="-48" fill="#54362F" stroke="none" fontSize="15" fontWeight="700">N</text></g>
            <path d="M200 0v320M400 0v320" stroke="#B78358" strokeWidth="2" strokeDasharray="5 6" opacity=".28" />
            <path d="M195 0h10v320h-10zM395 0h10v320h-10z" fill="#54362F" opacity=".035" />
          </svg>
          <span className="absolute left-1/3 top-0 h-full w-px bg-choco/10" />
          <span className="absolute left-2/3 top-0 h-full w-px bg-choco/10" />
        </div>
        <div className="absolute bottom-[1px] left-[1px] w-[96px] -rotate-[7deg] rounded-[7px] bg-milk p-1.5 pb-4 shadow-[0_10px_20px_rgba(74,44,42,.17)] sm:left-[2px] sm:w-[110px]">
          <div className="relative h-[65px] overflow-hidden rounded-[3px] bg-skySoft sm:h-[76px]"><Image src="/images/photos/bay-mascots.webp" alt="Бирюзовая бухта и набережная на Хайнане" fill sizes="110px" className="object-cover" /></div>
          <p className="mt-1 text-center font-narrow text-[8px] font-bold text-choco">мы уже были здесь</p>
        </div>
        <span className="absolute bottom-[12px] right-[4px] rotate-[5deg] rounded-full border border-[#477E99]/25 bg-skySoft px-3 py-1 font-narrow text-[9px] font-bold text-[#477E99] shadow-sm">7 категорий · 13 мест</span>
      </div>
    </Scene>
  );
}

function ItemVisual({ item }: { item: RoadItem }) {
  if (item.visual === "phone") return <PhoneScene />;
  if (item.visual === "ticket") return <TicketScene />;
  if (item.visual === "suitcase") return <SuitcaseScene />;
  if (item.visual === "camera") return <CameraScene />;
  if (item.visual === "cup") return <CupScene />;
  return <MapScene />;
}

export default function RoadItems() {
  const [activeId, setActiveId] = useState(items[0].id);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const active = items[activeIndex];

  const selectAt = (index: number) => {
    const next = (index + items.length) % items.length;
    setActiveId(items[next].id);
    buttonRefs.current[next]?.focus();
  };

  return (
    <section id="suitcase" className="relative overflow-hidden bg-milk py-20 md:py-28">
      <Image src="/images/decor/angel-cookie.png" alt="" width={110} height={110} className="pointer-events-none absolute -right-5 top-16 w-20 rotate-12 opacity-70 sm:right-[4%] sm:w-24 lg:hidden min-[1440px]:right-[1%] min-[1440px]:block" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep">Дорожный чемодан · 6 предметов</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] text-ink md:text-5xl">Всё нужное уже собрано. <span className="text-deep">Распакуем?</span></h2>
          </div>
          <p className="max-w-md leading-relaxed text-muted lg:justify-self-end">Выбирай предмет — покажем, какая часть курса спрятана внутри. Никаких абстрактных обещаний, только то, чем будешь пользоваться в поездке.</p>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-[0.62fr_1.38fr] lg:gap-10">
          <div role="tablist" aria-label="Предметы из дорожного чемодана" className="grid grid-cols-3 self-start overflow-hidden rounded-[20px] border border-choco/10 bg-card/45 p-1.5 shadow-[0_8px_24px_rgba(74,44,42,.05)] lg:grid-cols-1 lg:rounded-[26px] lg:p-2">
            {items.map((item, index) => {
              const selected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  ref={(node) => { buttonRefs.current[index] = node; }}
                  id={`suitcase-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="suitcase-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); selectAt(index + 1); }
                    if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); selectAt(index - 1); }
                    if (event.key === "Home") { event.preventDefault(); selectAt(0); }
                    if (event.key === "End") { event.preventDefault(); selectAt(items.length - 1); }
                  }}
                  className={`group relative flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[15px] px-1.5 py-3 text-center transition-[transform,background-color,box-shadow] duration-200 ease-out focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep active:scale-[.98] lg:min-h-[82px] lg:flex-row lg:justify-start lg:gap-4 lg:px-4 lg:text-left ${selected ? `${item.activeClass} shadow-[inset_0_0_0_1px_rgba(74,44,42,.09)]` : "bg-transparent hover:-translate-y-0.5 hover:bg-card"}`}
                >
                  {selected && <span aria-hidden="true" className="pointer-events-none absolute inset-[5px] rounded-[10px] border border-dashed border-choco/15" />}
                  <item.icon size={28} className={`relative shrink-0 transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 ${selected ? item.iconClass : "text-choco/60"}`} />
                  <span className="relative lg:flex-1">
                    <span className="block font-display text-[13px] font-bold text-ink sm:text-sm lg:text-base">{item.object}</span>
                    <span className="mt-0.5 hidden text-xs leading-snug text-choco/60 sm:block">{item.note}</span>
                  </span>
                  <span aria-hidden="true" className={`relative hidden font-narrow text-xs font-bold lg:block ${selected ? "text-choco/55" : "text-choco/25"}`}>0{index + 1}</span>
                </button>
              );
            })}
          </div>

          <article key={active.id} id="suitcase-panel" role="tabpanel" aria-labelledby={`suitcase-tab-${active.id}`} className="item-copy-enter overflow-hidden rounded-[28px] border border-choco/[0.07] bg-card shadow-[0_18px_50px_rgba(74,44,42,0.11)] sm:rounded-[34px]">
            <div className={`relative h-[300px] sm:h-[350px] ${active.sceneClass}`}>
              <ItemVisual item={active} />
              <div className="pointer-events-none absolute inset-x-5 top-4 flex items-center justify-between gap-3 font-narrow text-[10px] font-bold uppercase tracking-[0.16em] text-choco/55 sm:inset-x-7 sm:top-5 sm:text-[11px]">
                <span>{active.object} · дорожная находка</span>
                <span className="shrink-0">0{activeIndex + 1} <span className="text-choco/30">/ 06</span></span>
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[20px] border border-dashed border-choco/10 sm:inset-4 sm:rounded-[24px]" />
            </div>
            <div className="p-6 sm:p-8 md:p-9">
              <p className={`text-xs font-bold uppercase tracking-[0.16em] ${active.iconClass}`}>{active.object} · {active.note}</p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ink md:text-3xl">{active.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{active.description}</p>
              <ul className="mt-6 grid gap-3 border-t border-dashed border-choco/20 pt-5 sm:grid-cols-3">
                {active.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-choco">
                    <span aria-hidden="true" className={`mt-0.5 shrink-0 ${active.iconClass}`}><IconCheck size={15} /></span>{bullet}
                  </li>
                ))}
              </ul>
              <Link href={active.cta.href} className="mt-7 inline-flex min-h-[44px] items-center gap-2 font-semibold text-deep underline decoration-pastel decoration-2 underline-offset-4 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep">
                {active.cta.label} <IconArrowRight size={18} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
