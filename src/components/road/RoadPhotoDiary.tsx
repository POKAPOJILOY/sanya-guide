import Image from "next/image";
import Reveal from "@/components/Reveal";

const diaryPhotos = [
  {
    src: "/images/photos/cafe-teddy.webp",
    alt: "Уютное кафе с большим плюшевым мишкой — фотография Сабины",
    caption: "кафе с плюшевым настроением",
    ratio: "aspect-[3/4]",
    layout: "md:rotate-[-2.5deg]",
    tape: "bg-butter/70",
  },
  {
    src: "/images/photos/raccoon-friends.webp",
    alt: "Еноты на деревянной террасе — фотография Сабины",
    caption: "неожиданные новые знакомые",
    ratio: "aspect-[4/3]",
    layout: "md:mt-16 md:rotate-[1.8deg]",
    tape: "bg-sky/70",
  },
  {
    src: "/images/photos/care-bears.webp",
    alt: "Яркая витрина с игрушками Care Bears — фотография Сабины",
    caption: "полка, мимо которой не пройти",
    ratio: "aspect-[3/4]",
    layout: "md:mt-5 md:rotate-[-1.5deg]",
    tape: "bg-pastel/80",
  },
  {
    src: "/images/photos/sabina-pink-walk.webp",
    alt: "Сабина в розовом платье на прогулке у кафе",
    caption: "прогулка в розовом настроении",
    ratio: "aspect-[3/4]",
    layout: "md:mt-16 md:rotate-[2.2deg]",
    tape: "bg-pastel/80",
  },
  {
    src: "/images/photos/hainan-sunset.webp",
    alt: "Спокойный закат над морем — фотография Сабины",
    caption: "закат, ради которого стоит остаться",
    ratio: "aspect-[4/3]",
    layout: "md:mt-9 md:rotate-[-2deg]",
    tape: "bg-sky/70",
  },
];

export default function RoadPhotoDiary() {
  return (
    <section id="diary" className="overflow-hidden bg-butter/20 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="grid gap-5 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep">
              Пять кадров из поездок
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-ink md:text-5xl">
              Из дневника <span className="text-deep">Сабины</span>
            </h2>
          </div>
          <p className="max-w-md text-muted md:col-span-5 md:justify-self-end">
            Кафе, прогулки, сувениры и маленькие радости — всё, из чего складывается путешествие.
          </p>
        </Reveal>

        <p className="mt-8 text-right font-narrow text-xs font-bold uppercase tracking-[0.12em] text-choco/55 md:hidden">
          листай фотографии →
        </p>

        <Reveal>
          <div
            role="region"
            aria-label="Фотографии из поездок Сабины"
            tabIndex={0}
            className="-mx-4 mt-4 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-4 pb-6 pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep md:mx-0 md:mt-12 md:grid md:grid-cols-[1.05fr_1.05fr_.8fr_1.2fr_.9fr] md:snap-none md:items-start md:gap-5 md:overflow-visible md:px-0 md:pb-10"
          >
            {diaryPhotos.map((photo, index) => (
              <figure
                key={photo.src}
                className={`relative w-[74vw] max-w-[300px] shrink-0 snap-center rounded-[5px] bg-milk p-2 pb-3 shadow-[0_14px_30px_rgba(74,44,42,.13)] md:w-auto md:max-w-none ${index % 2 === 0 ? "-rotate-2" : "rotate-2"} ${photo.layout}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 rotate-1 ${photo.tape}`}
                />
                <div className={`relative overflow-hidden rounded-[2px] bg-pastel ${photo.ratio}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 767px) 74vw, (max-width: 1200px) 25vw, 280px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 min-h-8 font-narrow text-xs font-bold leading-snug text-choco/70">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
