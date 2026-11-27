const flowerPath = Array.from({ length: 96 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 96;
  const radius = 88 + 16 * Math.cos(angle * 6);
  const x = 110 + radius * Math.cos(angle);
  const y = 110 + radius * Math.sin(angle);
  return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
}).join(" ") + " Z";

export default function SabinaFlowerAvatar() {
  return (
    <figure className="relative w-48 shrink-0 md:w-52">
      <svg
        viewBox="0 0 220 220"
        role="img"
        aria-label="Сабина — автор курса — с путеводителем по Китаю"
        className="block w-full -rotate-3 overflow-visible drop-shadow-[0_14px_16px_rgba(74,44,42,.16)]"
      >
        <defs>
          <clipPath id="sabina-flower-avatar-inner">
            <path
              d={flowerPath}
              transform="translate(110 110) scale(.94) translate(-110 -110)"
            />
          </clipPath>
        </defs>
        <path d={flowerPath} fill="#FFDCE8" />
        <g clipPath="url(#sabina-flower-avatar-inner)">
          <image
            href="/images/photos/sabina-guide.webp"
            x="0"
            y="0"
            width="220"
            height="220"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
        <path
          d={flowerPath}
          fill="none"
          stroke="#4A2C2A"
          strokeOpacity="0.1"
          strokeWidth="1.5"
        />
      </svg>
      <figcaption className="mt-2 text-center font-narrow text-[10px] font-bold uppercase tracking-[0.08em] text-choco/60">
        Сабина · автор курса
      </figcaption>
    </figure>
  );
}
