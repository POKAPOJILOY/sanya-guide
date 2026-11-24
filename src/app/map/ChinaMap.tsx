"use client";

import { useState } from "react";
import Link from "next/link";
import { IconPalm, IconPlane, IconShell, IconSun } from "@/components/icons";

type City = {
  name: string;
  x: number;
  y: number;
};

const soonCities: City[] = [
  { name: "Харбин", x: 558, y: 131 },
  { name: "Пекин", x: 464, y: 210 },
  { name: "Сиань", x: 394, y: 286 },
  { name: "Чэнду", x: 349, y: 336 },
  { name: "Чунцин", x: 372, y: 350 },
  { name: "Шанхай", x: 511, y: 328 },
  { name: "Ханчжоу", x: 499, y: 340 },
  { name: "Гуйлинь", x: 407, y: 408 },
  { name: "Гуанчжоу", x: 435, y: 437 },
  { name: "Шэньчжэнь", x: 442, y: 446 },
];

// Упрощённый художественный силуэт Китая (не точная география)
const chinaOutline =
  "66,216 78,204 88,196 129,140 147,112 178,113 198,86 227,118 278,173 " +
  "348,185 422,140 466,75 497,39 504,39 529,27 557,36 593,89 619,96 634,96 " +
  "619,136 608,143 595,178 538,211 511,197 507,225 479,220 490,239 522,244 " +
  "506,258 499,286 514,325 494,317 505,317 507,338 480,341 512,359 498,382 " +
  "480,418 465,434 443,445 439,444 435,449 421,459 409,475 386,461 360,436 " +
  "347,445 328,444 312,459 304,449 299,424 289,367 276,352 262,352 238,374 " +
  "200,373 176,369 144,342 122,334 115,310 110,286 87,250 68,233";

const hainan =
  "M395,478 Q402,471 410,477 Q416,484 413,493 Q408,503 399,502 Q390,499 389,489 Q390,481 395,478 Z";

const SANYA = { x: 399, y: 502 };

// Пунктирные авиамаршруты к городу Санья
const routes = [
  "M464,210 Q560,340 399,502", // Пекин
  "M511,328 Q580,430 399,502", // Шанхай
  "M349,336 Q290,420 399,502", // Чэнду
];

const illustrations = [
  { Icon: IconSun, x: 96, y: 36, size: 44 },
  { Icon: IconPlane, x: 672, y: 282, size: 40 },
  { Icon: IconPalm, x: 222, y: 536, size: 44 },
  { Icon: IconShell, x: 596, y: 548, size: 36 },
];

export default function ChinaMap() {
  const [active, setActive] = useState<City | null>(null);

  return (
    <div
      className="relative overflow-hidden rounded-card border border-blush shadow-soft"
      onClick={() => setActive(null)}
    >
      <svg
        viewBox="0 0 800 640"
        role="img"
        aria-label="Стилизованная карта Китая с городами курса"
        className="block h-auto w-full select-none"
      >
        <defs>
          <linearGradient id="chinaFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE3EC" />
            <stop offset="100%" stopColor="#FFD0DE" />
          </linearGradient>
          <pattern id="oceanWaves" width="56" height="18" patternUnits="userSpaceOnUse">
            <path
              d="M0,9 Q14,1 28,9 T56,9"
              fill="none"
              stroke="#BFDFE8"
              strokeWidth="2"
              opacity="0.6"
            />
          </pattern>
          <pattern id="chinaDots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="#F2689C" opacity="0.12" />
          </pattern>
          <filter id="chinaShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="12"
              floodColor="#D63D7C"
              floodOpacity="0.22"
            />
          </filter>
        </defs>

        {/* океан */}
        <rect width="800" height="640" fill="#EAF6F8" />
        <rect width="800" height="640" fill="url(#oceanWaves)" />

        {/* суша: тень + градиент + текстура */}
        <g filter="url(#chinaShadow)">
          <polygon
            points={chinaOutline}
            fill="url(#chinaFill)"
            stroke="#D63D7C"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path
            d={hainan}
            fill="url(#chinaFill)"
            stroke="#D63D7C"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </g>
        <polygon points={chinaOutline} fill="url(#chinaDots)" />
        <path d={hainan} fill="url(#chinaDots)" />

        {/* авиамаршруты */}
        {routes.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#F2689C"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.75}
            className="flight-route"
          />
        ))}

        {/* пастельные иллюстрации вместо эмодзи */}
        {illustrations.map(({ Icon, x, y, size }) => (
          <Icon
            key={x}
            x={x}
            y={y}
            size={size}
            color="#F2689C"
            opacity={0.75}
          />
        ))}

        {soonCities.map((city) => (
          <g
            key={city.name}
            role="button"
            tabIndex={0}
            aria-label={`${city.name} — скоро`}
            className="cursor-pointer focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setActive(active?.name === city.name ? null : city);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(active?.name === city.name ? null : city);
              }
            }}
          >
            <circle cx={city.x} cy={city.y} r={24} fill="transparent" />
            <circle
              cx={city.x}
              cy={city.y}
              r={7}
              fill="#C98AA5"
              stroke="#FFFFFF"
              strokeWidth={3}
            />
            {active?.name === city.name && (
              <>
                <text
                  x={city.x + 12}
                  y={city.y - 2}
                  fontSize={14}
                  fontWeight={700}
                  fill="#3D2233"
                  stroke="#EAF6F8"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {city.name}
                </text>
                <text
                  x={city.x + 12}
                  y={city.y + 11}
                  fontSize={10}
                  fontWeight={600}
                  fill="#8A6B7A"
                  stroke="#EAF6F8"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  скоро
                </text>
              </>
            )}
          </g>
        ))}

        {/* Санья — визуал; клик ловит HTML-оверлей под SVG */}
        <g aria-hidden="true" pointerEvents="none">
          <circle
            cx={SANYA.x}
            cy={SANYA.y}
            r={12}
            fill="#F2689C"
            className="pulse-ring"
          />
          <circle
            cx={SANYA.x}
            cy={SANYA.y}
            r={10}
            fill="#F2689C"
            stroke="#FFFFFF"
            strokeWidth={3}
          />
          <text
            x={SANYA.x + 18}
            y={SANYA.y + 10}
            fontSize={32}
            fontWeight={700}
            fill="#D63D7C"
            stroke="#EAF6F8"
            strokeWidth={4}
            paintOrder="stroke"
          >
            Санья
          </text>
        </g>
      </svg>

      {/* Надёжная зона тапа по городу Санья (точка + подпись), ≥48px */}
      <Link
        href="/city/sanya"
        aria-label="Санья — открыть карту мест"
        className="absolute z-10 block min-h-[48px] min-w-[48px] rounded-card"
        style={{
          left: `${(SANYA.x / 800) * 100}%`,
          top: `${(SANYA.y / 640) * 100}%`,
          width: "26%",
          height: "9%",
          transform: "translate(-30%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {active && (
        <div
          role="status"
          className="absolute z-20 w-56 rounded-card border border-blush bg-card p-4 text-center shadow-lift"
          style={{
            left: `${(active.x / 800) * 100}%`,
            top: `${(active.y / 640) * 100}%`,
            transform:
              active.y < 200
                ? "translate(-50%, 1rem)"
                : "translate(-50%, calc(-100% - 1rem))",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-display font-bold text-ink">
            {active.name} — скоро!
          </p>
          <p className="mt-1 text-sm text-muted">
            Покупатели курса получат все города бесплатно
          </p>
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Закрыть"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-blush hover:text-deep"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
