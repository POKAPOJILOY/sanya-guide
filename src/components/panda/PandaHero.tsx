"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PandaScene = dynamic(() => import("./PandaScene"), { ssr: false });

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* Стикеры вокруг панды (SVG в стиле проекта, белая подложка = обводка) */
const IconSuitcase = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#D63D7C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <rect x="4" y="8" width="16" height="12" rx="2.5" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    <path d="M4 13h16" />
    <path d="M10 13v3h4v-3" />
  </svg>
);

const IconCocktail = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#D63D7C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M5 5h14l-7 8-7-8Z" />
    <path d="M12 13v6" />
    <path d="M8 21h8" />
    <path d="M16 5l3-3" />
    <circle cx="17" cy="8" r="1.6" />
  </svg>
);

const IconHat = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#D63D7C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M3 17c3-1.5 6-2 9-2s6 .5 9 2" />
    <path d="M7.5 15.5C7.5 10 9.5 7 12 7s4.5 3 4.5 8.5" />
    <path d="M12 7c0-1.5.8-2.5 2-3" />
  </svg>
);

const IconPlaneTrail = (
  <svg viewBox="0 0 32 24" fill="none" stroke="#D63D7C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M22.5 10.5 16 8l1-1 4.5.4 3.3-4.2c.7-.8 1.7-1 2.3-.4.6.6.4 1.6-.3 2.3l-3.3 4.4.6 4.5-1.3 1.2-2.4-4.7Z" />
    <path d="m22.5 10.5 4.8-4.8" />
    <path d="M3 20c3-1 5-3 6.5-5.5" strokeDasharray="2.5 3" />
  </svg>
);

const stickers = [
  { icon: IconSuitcase, className: "left-0 top-[12%] h-12 w-12 -rotate-3", delay: "0.6s" },
  { icon: IconCocktail, className: "right-0 top-[8%] h-12 w-12 rotate-3", delay: "1.4s" },
  { icon: IconPlaneTrail, className: "left-[4%] bottom-[26%] h-14 w-14 rotate-2", delay: "0.7s" },
  { icon: IconHat, className: "bottom-[20%] right-[2%] h-12 w-12 -rotate-2", delay: "2s" },
];

export default function PandaHero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [use3d, setUse3d] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUse3d(!reduced && webglAvailable());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "240px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-md cursor-pointer select-none"
      aria-hidden="true"
    >
      {/* пьедестал-эллипс со «стежком» */}
      <div className="stitch absolute inset-x-2 bottom-1 h-28 rounded-[50%] bg-gradient-to-br from-blush to-pastel" />

      {/* лента-скотч на углу подложки */}
      <span className="tape -right-2 top-6 z-20" style={{ transform: "rotate(-8deg)" }} />

      <div className="relative aspect-square">
        {/* постер: фолбэк без WebGL и плейсхолдер, пока грузится GLB */}
        <Image
          src="/images/panda-bao-poster.png"
          alt=""
          width={896}
          height={896}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
            use3d && ready ? "opacity-0" : "opacity-100"
          }`}
          priority
        />
        {use3d && inView && (
          <PandaScene running={visible} onReady={() => setReady(true)} />
        )}
      </div>

      {/* стикеры с белой обводкой, парят */}
      {stickers.map((s, i) => (
        <span
          key={i}
          className={`float absolute z-20 rounded-2xl bg-white p-2 shadow-soft ${s.className}`}
          style={{ animationDelay: s.delay }}
        >
          {s.icon}
        </span>
      ))}
    </div>
  );
}
