import type { Metadata } from "next";
import FreemiumBar from "@/components/FreemiumBar";
import Header from "@/components/ui/Header";
import { getPlaces, getPlacesCount } from "@/lib/data";
import SanyaExplorer from "./SanyaExplorer";

export const metadata: Metadata = {
  title: "Санья — карта мест — Санья Гид",
  description:
    "Интерактивная карта города Санья: пляжи, парки, рынки и спа. Все места — в полной версии курса.",
};

export default async function SanyaPage({
  searchParams,
}: {
  searchParams: { place?: string };
}) {
  const [places, count] = await Promise.all([
    getPlaces("sanya"),
    getPlacesCount("sanya"),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            Санья — карта мест
          </h1>
          <p className="mt-2 text-xl font-semibold text-accent md:text-2xl">
            тыкай на пины — я всё покажу
          </p>
          <p className="mt-1 text-sm text-muted">мест на карте: {count}</p>
        </div>
        <SanyaExplorer places={places} focusSlug={searchParams.place} />
      </main>
      <FreemiumBar />
    </>
  );
}
