"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

const RoadTransitionScene = dynamic(() => import("./RoadTransitionScene"), {
  ssr: false,
});

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneFailureBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function StaticScene({ showObjects }: { showObjects: boolean }) {
  return (
    <svg
      viewBox="0 0 800 600"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="400" cy="498" rx="205" ry="30" fill="#4A2C2A" opacity="0.09" />
      <g transform="translate(0 12)">
        <rect x="245" y="205" width="310" height="185" rx="42" fill="#FCF0D4" stroke="#F2CE6B" strokeWidth="22" />
        <rect x="220" y="363" width="360" height="132" rx="38" fill="#F2CE6B" />
        <rect x="239" y="377" width="322" height="42" rx="22" fill="#FCF0D4" />
        <rect x="353" y="466" width="94" height="18" rx="9" fill="#4A2C2A" />
        {/* До старта прокрутки заглушка показывает только чемодан, как и настоящая сцена. */}
        {showObjects && (
          <g>
            <g transform="translate(126 220) rotate(-9)">
              <rect width="78" height="128" rx="15" fill="#4A2C2A" />
              <rect x="8" y="12" width="62" height="101" rx="10" fill="#E1EEF9" />
              <rect x="20" y="34" width="38" height="12" rx="6" fill="#FFFFFF" />
              <rect x="20" y="58" width="38" height="12" rx="6" fill="#FFDCE8" />
            </g>
            <g transform="translate(240 125) rotate(8)">
              <rect width="138" height="78" rx="13" fill="#FFFFFF" />
              <rect width="34" height="78" rx="11" fill="#A9CDE9" />
              <path d="M54 24h58M54 42h43" stroke="#C99C62" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g transform="translate(385 96)">
              <rect width="122" height="78" rx="20" fill="#FFFFFF" />
              <circle cx="65" cy="40" r="28" fill="#4A2C2A" />
              <circle cx="65" cy="40" r="16" fill="#A9CDE9" />
              <rect x="17" y="-10" width="40" height="18" rx="7" fill="#4A2C2A" />
            </g>
            <g transform="translate(560 172)">
              <path d="M12 0h66l-7 73a25 25 0 0 1-52 0Z" fill="#FFFFFF" />
              <path d="M77 17c40-4 40 48-3 44" fill="none" stroke="#FFFFFF" strokeWidth="14" />
              <ellipse cx="45" cy="82" rx="55" ry="10" fill="#FFDCE8" />
            </g>
            <g transform="translate(610 286) rotate(9)">
              <path d="M0 0 42 9 82 0v105l-40 9L0 105Z" fill="#E1EEF9" />
              <path d="m42 9 40-9v105l-40 9Z" fill="#EBF3E0" />
              <path d="m14 73 48-29" stroke="#F3B7CB" strokeWidth="6" strokeLinecap="round" />
              <circle cx="61" cy="42" r="9" fill="#F3B7CB" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}

export default function RoadTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [loadScene, setLoadScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.01) {
          if (supportsWebGL()) setLoadScene(true);
          else setSceneFailed(true);
          observer.disconnect();
        }
      },
      // Нулевое пересечение на нижней границе первого экрана сцену не запускает.
      { threshold: 0.01 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const update = () => {
      frameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const compact = window.innerWidth < 768;
      const headerHeight = compact ? 69 : 61;
      const rect = section.getBoundingClientRect();
      // На телефоне берём стабильную svh-высоту sticky-сцены:
      // панель Safari меняет window.innerHeight, но не должна передвигать предметы.
      const viewportHeight =
        compact && stickyRef.current
          ? stickyRef.current.clientHeight
          : window.innerHeight - headerHeight;
      const scrollable = Math.max(1, rect.height - viewportHeight);
      const next = clamp01((headerHeight - rect.top) / scrollable);
      setProgress((current) => (Math.abs(current - next) > 0.0005 ? next : current));
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [reduced]);

  const effectiveProgress = reduced ? 1 : progress;
  const introOpacity = reduced ? 0 : 1 - clamp01(progress / 0.24);
  const outroOpacity = reduced ? 1 : clamp01((progress - 0.64) / 0.18);
  const finalInteractive = reduced || outroOpacity > 0.8;

  return (
    <section
      ref={sectionRef}
      id="road-transition"
      aria-label="Бао распаковывает дорожный чемодан"
      data-progress={effectiveProgress.toFixed(3)}
      data-scene-ready={sceneReady ? "true" : "false"}
      data-scene-failed={sceneFailed ? "true" : "false"}
      className="relative h-[190svh] scroll-mt-[4.3125rem] bg-milk motion-reduce:h-auto md:h-[200svh] md:scroll-mt-[3.8125rem] md:motion-reduce:h-auto"
    >
      <div ref={stickyRef} className="sticky top-[4.3125rem] h-[calc(100svh-4.3125rem)] overflow-hidden bg-milk motion-reduce:relative motion-reduce:top-0 md:top-[3.8125rem] md:h-[calc(100svh-3.8125rem)] md:motion-reduce:top-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#FFFFFF_0%,#FFFBF3_52%,#FCF0D4_130%)]" aria-hidden="true" />

        <div className={`absolute inset-0 transition-opacity duration-200 ${sceneReady && loadScene && !sceneFailed ? "opacity-0" : "opacity-100"}`}>
          <StaticScene showObjects={effectiveProgress >= 0.2} />
        </div>

        {loadScene && !sceneFailed && (
          <SceneFailureBoundary
            onFailure={() => {
              setSceneFailed(true);
              setSceneReady(false);
            }}
          >
            <RoadTransitionScene progress={effectiveProgress} onReady={() => setSceneReady(true)} />
          </SceneFailureBoundary>
        )}

        <div
          className="pointer-events-none absolute inset-x-4 top-8 mx-auto max-w-2xl text-center md:top-12"
          style={{ opacity: introOpacity, transform: `translateY(${(1 - introOpacity) * -12}px)` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep md:text-xs">
            Из дорожного кино — в чемодан
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-5xl">
            Бао собрал главное
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted md:text-base">
            Листай — крышка откроется, а предметы покажут, из чего состоит курс.
          </p>
        </div>

        <div
          className="pointer-events-none absolute inset-x-4 top-8 mx-auto max-w-2xl text-center md:top-12"
          style={{ opacity: outroOpacity, transform: `translateY(${(1 - outroOpacity) * 12}px)` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep md:text-xs">
            Шесть предметов · целый спокойный Китай
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-5xl">
            Всё на своих местах
          </h2>
        </div>

        <div
          className="absolute inset-x-0 bottom-12 flex justify-center md:bottom-14"
          style={{ opacity: outroOpacity }}
        >
          <a
            href="#suitcase"
            tabIndex={finalInteractive ? 0 : -1}
            aria-hidden={!finalInteractive}
            className={`min-h-[44px] rounded-full border border-blush bg-card/90 px-5 py-2.5 text-sm font-semibold text-deep shadow-soft backdrop-blur transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-deep ${finalInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            Выбрать предмет ↓
          </a>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => {
            const active = effectiveProgress >= index / 5;
            return (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-200 ${active ? "w-5 bg-deep/65" : "w-1.5 bg-choco/20"}`}
              />
            );
          })}
        </div>

        <p className="sr-only">
          Во время прокрутки чемодан открывается, из него появляются телефон, билет, камера, чашка и карта.
          Внутри лежит чек-лист. Следующий раздел позволяет выбрать каждый из шести предметов и узнать о нём подробнее.
        </p>
      </div>
    </section>
  );
}
