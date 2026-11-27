import Image from "next/image";
import Reveal from "@/components/Reveal";

type CourseStep = {
  title: string;
  text: string;
};

const chapterLabels = ["До вылета", "Телефон и деньги", "Уже на острове", "Всегда с собой"];

function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-7 w-24 bg-[#EAC778]/55 shadow-sm backdrop-blur-[1px] ${className}`}
    />
  );
}

export default function RoadCourse({ steps }: { steps: CourseStep[] }) {
  return (
    <section id="course" className="relative overflow-hidden bg-butterSoft/45 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(84,54,47,.12)_1px,transparent_1px),linear-gradient(rgba(84,54,47,.1)_1px,transparent_1px)] [background-size:5px_5px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-36 h-72 w-72 rounded-full bg-pastel/35 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-skySoft/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.65fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep">От вылета до последнего кокоса</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] text-ink md:text-5xl">
                Не набор ссылок. <span className="text-deep">Спокойная поездка.</span>
              </h2>
            </div>
            <p className="max-w-md leading-relaxed text-muted lg:justify-self-end">
              Сабина разложила весь опыт по порядку: сначала подготовить телефон и документы, затем открыть карту и просто наслаждаться Хайнанем.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16">
            <div className="relative">
              {steps.map((item, index) => {
                const label = chapterLabels[index];
                return (
                  <article key={item.title} className={`relative grid grid-cols-[58px_1fr] gap-4 border-t border-choco/15 py-6 sm:grid-cols-[68px_1fr] sm:gap-5 sm:py-7 ${index === steps.length - 1 ? "border-b" : ""}`}>
                    <div className="flex h-14 w-14 items-center">
                      <span className="font-narrow text-2xl font-bold text-deep/70">0{index + 1}</span>
                    </div>
                    <div className="pt-0.5">
                      <p className="font-narrow text-[11px] font-bold uppercase tracking-[0.16em] text-deep/65">{label}</p>
                      <h3 className="mt-1.5 font-display text-xl font-bold text-ink sm:text-2xl">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{item.text}</p>
                    </div>
                  </article>
                );
              })}
              <div className="ml-[74px] mt-9 inline-flex items-center gap-3 border-t border-dashed border-choco/20 pt-4 font-narrow text-xs font-bold uppercase tracking-[0.12em] text-choco/60 sm:ml-[88px]">
                <span className="h-2 w-2 rounded-full bg-deep/70" />
                4 главы · в своём темпе
              </div>
            </div>

            <div className="relative mx-auto mt-14 h-[570px] w-full max-w-[520px] sm:h-[640px] lg:mt-0 lg:h-[620px]">
              <figure className="absolute left-0 top-0 w-[82%] -rotate-[2.5deg] rounded-[5px] bg-milk p-2.5 pb-4 shadow-[0_22px_45px_rgba(74,44,42,.15)] sm:p-3 sm:pb-5">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
                <div className="relative aspect-[4/4.1] overflow-hidden rounded-[2px] bg-pastel">
                  <Image
                    src="/images/photos/coconut-beach.webp"
                    alt="Кокос с цветком на песчаном пляже Хайнаня"
                    fill
                    sizes="(max-width: 1024px) 72vw, 32vw"
                    className="object-cover"
                  />
                  <span className="absolute right-3 top-3 flex h-20 w-20 rotate-12 items-center justify-center rounded-full border-2 border-milk/85 bg-deep/75 text-center font-narrow text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-milk shadow-lg backdrop-blur-sm">
                    доступ<br />навсегда
                  </span>
                </div>
                <figcaption className="mt-3 px-1 font-narrow text-[9px] font-bold uppercase tracking-[0.08em] text-choco/60 sm:text-[10px]">
                  Заметки Сабины · Хайнань · <span className="text-deep">проверено в поездках</span>
                </figcaption>
              </figure>

              <figure className="absolute bottom-[18px] right-0 z-10 w-[43%] rotate-[5deg] rounded-[4px] bg-milk p-2 pb-3 shadow-[0_17px_35px_rgba(74,44,42,.16)]">
                <Tape className="-top-3 right-4 w-16 rotate-6" />
                <div className="relative aspect-square overflow-hidden rounded-[2px] bg-pastel">
                  <Image
                    src="/images/photos/seaside-breakfast-bow.webp"
                    alt="Завтрак у моря с большим розовым бантом — фотография Сабины"
                    fill
                    sizes="(max-width: 1024px) 38vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-center font-narrow text-[10px] font-bold text-choco/65">и ещё много вкусного</figcaption>
              </figure>

              <aside className="absolute bottom-0 left-[2%] w-[52%] -rotate-2 bg-skySoft p-4 shadow-[0_12px_28px_rgba(74,44,42,.09)] sm:p-5">
                <span aria-hidden="true" className="absolute left-0 top-0 h-full w-full border border-dashed border-[#7FA8BA]/35" />
                <p className="relative font-narrow text-[10px] font-bold uppercase tracking-[0.16em] text-[#477E99]">На полях написано</p>
                <p className="relative mt-2 font-display text-base font-bold leading-snug text-ink sm:text-lg">
                  Меньше «что мне делать?» — больше моря, вкусной еды и живых впечатлений.
                </p>
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
