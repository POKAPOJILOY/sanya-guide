"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { IconFlower, IconPalm } from "@/components/icons";

/* Полноэкранное «дорожное кино»: Бао с чемоданом идёт к морю.
   Текст, цена и кнопки видны сразу, поверх видео.
   - prefers-reduced-motion: видео не запускается, показываем статичный постер
   - нет WebGL/ошибка загрузки: постер остаётся на месте
   - видео ставится на паузу вне экрана и при свернутой вкладке */

const IconPlay = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);

const IconPause = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <rect x="6" y="5" width="4.5" height="14" rx="1.2" />
    <rect x="13.5" y="5" width="4.5" height="14" rx="1.2" />
  </svg>
);

const IconChevronDown = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* Небольшие тактильные сувениры без рамок: не закрывают ролик и текст. */
const keepsakes = [
  {
    src: "/images/decor/angel-cookie.png",
    className: "right-[3.5%] top-[13%] w-24 xl:w-28 rotate-[8deg]",
    duration: "6.8s",
  },
  {
    src: "/images/decor/flower-button.png",
    className: "bottom-[12%] right-[7%] w-24 xl:w-28 -rotate-[10deg]",
    duration: "7.6s",
  },
  {
    src: "/images/decor/flower-cookie.png",
    className: "bottom-[8%] left-[60%] w-16 xl:w-20 rotate-[12deg]",
    duration: "6.2s",
  },
];

export default function RoadHero({ narrowClass }: { narrowClass: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

  const handlePlaybackError = useCallback((error: unknown) => {
    const name =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name?: unknown }).name)
        : "";
    // Отменённый запуск — не повреждение файла: следующий вход в секцию сможет повторить play().
    if (name === "AbortError") return;
    // Safari запретил автозапуск: оставляем сам ролик и предлагаем настоящую кнопку «Смотреть».
    if (name === "NotAllowedError") {
      setPaused(true);
      return;
    }
    setFailed(true);
  }, []);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = true;
      // Непосредственный вызов в жесте пользователя важен для Safari.
      video.play().then(() => setPaused(false)).catch(handlePlaybackError);
    } else {
      video.pause();
      setPaused(true);
    }
  }, [handlePlaybackError]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // пауза вне экрана — не тратим батарейку и трафик
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Ошибка последнего <source> не всплывает до <video>; capture ловит её на самом источнике.
    const onMediaError = () => setFailed(true);
    // Если источник уже успел отказать до effect, событие поздно ловить — проверяем итог выбора источника.
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      onMediaError();
      return;
    }
    video.addEventListener("error", onMediaError, true);
    return () => video.removeEventListener("error", onMediaError, true);
  }, [reduced]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !document.hidden && !paused) {
      if (!v.paused) return;
      v.muted = true;
      v.play().catch(handlePlaybackError);
    } else {
      v.pause();
    }
  }, [handlePlaybackError, inView, paused, reduced]);

  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) {
        v.pause();
      } else if (inView && !paused) {
        if (!v.paused) return;
        v.muted = true;
        v.play().catch(handlePlaybackError);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [handlePlaybackError, inView, paused]);

  const showVideo = !reduced && !failed;
  const pausedByUser = paused || !inView;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4.3125rem)] items-end overflow-hidden bg-milk md:min-h-[calc(100svh-3.8125rem)] md:items-center"
      aria-label="Санья Гид — курс-путеводитель по Китаю"
    >
      {/* дорожное кино */}
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/road-hero-poster.jpg"
          onError={() => setFailed(true)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/video/road-hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/video/road-hero-poster-mobile.jpg"
          />
          {/* Статичный fallback: на телефоне вертикальный кадр, на desktop полный. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/video/road-hero-poster.jpg"
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}

      {/* Локальная вуаль только за компактным текстом: лицо Бао и предметы остаются открытыми. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,251,243,0.98)_0%,rgba(255,251,243,0.9)_30%,rgba(255,251,243,0.22)_59%,transparent_76%)] md:bg-[linear-gradient(90deg,rgba(255,251,243,0.97)_0%,rgba(255,251,243,0.84)_24%,rgba(255,251,243,0.28)_43%,transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-milk to-transparent"
      />

      {/* Печенья и пуговица — лёгкие сувениры вместо приклеенных фотографий. */}
      {keepsakes.map((item) => (
        <div
          key={item.src}
          aria-hidden="true"
          className={`pointer-events-none absolute z-[5] hidden select-none lg:block ${item.className}`}
        >
          <Image
            src={item.src}
            width={600}
            height={600}
            alt=""
            className="hero-keepsake h-auto w-full drop-shadow-[0_14px_16px_rgba(74,44,42,0.16)]"
            style={{ animationDuration: item.duration }}
          />
        </div>
      ))}

      {/* На телефоне бейдж живёт в свободном небе и не закрывает лицо Бао. */}
      <div className="absolute left-4 top-4 z-10 md:hidden">
        <Badge className="bg-pastel/90 backdrop-blur-sm">
          <IconPalm size={14} /> Курс-путеводитель по Китаю
        </Badge>
      </div>

      {/* Короткий overlay: смысл, цена и действия — без пересказа программы курса. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-[5.5rem] pt-24 md:pb-20 md:pt-28">
        <div className="max-w-[27rem] text-left">
          <div className="hidden md:block">
            <Badge className="bg-pastel/90 backdrop-blur-sm">
              <IconPalm size={14} /> Курс-путеводитель по Китаю
            </Badge>
          </div>
          <h1
            className={`mt-3 text-[2.55rem] font-bold leading-[0.98] text-deep md:mt-4 md:text-[3.4rem] ${narrowClass}`}
          >
            Китай — курс-путеводитель
          </h1>
          <p className="mt-4 max-w-[35ch] text-sm font-medium leading-relaxed text-choco/80 md:text-base">
            Начинаем с Саньи и Хайнаня. Новые города — бесплатно для покупателей.
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="pixel-accent text-2xl font-bold text-deep md:text-3xl">
              599 ₽
            </span>
            <span className="text-xs font-semibold text-choco/70 md:text-sm">
              доступ навсегда
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              href="/register"
              size="sm"
              className="h-12 px-4 md:h-[52px] md:px-6 md:text-base"
            >
              Купить доступ
            </Button>
            <Button
              href="/map"
              variant="secondary"
              size="sm"
              className="h-12 px-4 md:h-[52px] md:px-6 md:text-base"
            >
              Смотреть карту
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-1.5 font-display text-[11px] font-semibold text-choco/70 md:text-xs">
            <IconFlower size={15} className="shrink-0 text-deep" />
            Собрано Сабиной по любимым местам Хайнаня
          </p>
        </div>
      </div>

      {/* пауза/продолжить — только когда видео реально играет */}
      {showVideo && (
        <button
          type="button"
          onClick={toggleVideo}
          aria-pressed={pausedByUser}
          aria-label={pausedByUser ? "Продолжить видео" : "Поставить видео на паузу"}
          className="absolute bottom-5 right-4 z-20 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-blush bg-card/90 px-4 text-sm font-semibold text-ink shadow-soft backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep"
        >
          {pausedByUser ? IconPlay : IconPause}
          {pausedByUser ? "Смотреть" : "Пауза"}
        </button>
      )}

      {/* подсказка прокрутки к открывающемуся чемодану */}
      <a
        href="#road-transition"
        aria-label="Листай вниз — открыть дорожный чемодан"
        className="absolute bottom-5 left-1/2 z-20 hidden min-h-[44px] min-w-[44px] -translate-x-1/2 items-center justify-center rounded-full border border-blush bg-card/90 text-deep shadow-soft backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep md:inline-flex"
      >
        <span className="scroll-hint inline-flex">{IconChevronDown}</span>
      </a>
    </section>
  );
}
