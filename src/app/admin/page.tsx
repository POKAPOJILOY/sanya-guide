import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SessionConflict from "@/components/SessionConflict";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import {
  CategoryIcon,
  IconArrowRight,
  IconCrown,
  IconLock,
  IconPencil,
  IconPin,
} from "@/components/icons";
import { categories, type CategoryId } from "@/data/places";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { DEVICE_SESSION_COOKIE } from "@/lib/session";
import { placeSlug } from "@/lib/slug";
import { addCity, togglePlaceFree } from "./actions";
import CityStatusSelect from "./CityStatusSelect";
import ConfirmDelete from "./ConfirmDelete";
import PlaceForm from "./PlaceForm";

export const metadata: Metadata = {
  title: "Админка — Санья Гид",
};

export const dynamic = "force-dynamic";

const categoryLabel = (id: string) =>
  categories.find((c) => c.id === id)?.label ?? id;

const categoryId = (id: string): CategoryId =>
  categories.some((c) => c.id === id) ? (id as CategoryId) : "sights";

const okMessages: Record<string, string> = {
  "place-added": "Место добавлено",
  "place-updated": "Место сохранено",
  "place-deleted": "Место удалено",
  "free-toggled": "Доступ к месту обновлён",
  "city-added": "Город добавлен",
  "city-status": "Статус города обновлён",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { ok?: string; err?: string };
}) {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, session_id")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/login");

  const deviceSession = cookies().get(DEVICE_SESSION_COOKIE)?.value;
  if (!profile.session_id || profile.session_id !== deviceSession) {
    return (
      <>
        <Header />
        <SessionConflict />
      </>
    );
  }

  const admin = createAdminClient();
  const { data: cities } = await admin
    .from("cities")
    .select("*")
    .order("sort");
  const sanya = cities?.find((c) => c.slug === "sanya");
  const { data: places } = sanya
    ? await admin
        .from("places")
        .select("*")
        .eq("city_id", sanya.id)
        .order("sort")
    : { data: [] };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="text-center">
          <h1 className="inline-flex items-center gap-2 font-display text-3xl font-bold md:text-4xl">
            Админка <IconCrown size={28} className="text-deep" />
          </h1>
          <p className="mt-2 text-xl font-semibold text-accent">
            управляем гидом
          </p>
        </div>

        {(searchParams.ok || searchParams.err) && (
          <div
            className={`mt-6 rounded-2xl px-5 py-3 text-center text-sm font-semibold ${
              searchParams.err
                ? "border-2 border-accent bg-blush text-deep"
                : "border-2 border-pastel bg-card text-deep"
            }`}
          >
            {searchParams.err
              ? `Не получилось: ${searchParams.err}`
              : okMessages[searchParams.ok ?? ""] ?? "Готово"}
          </div>
        )}

        {/* Места Санья */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">
            Места (Санья)
            {places?.length ? (
              <span className="ml-2 rounded-full bg-pastel px-3 py-0.5 align-middle text-sm font-bold text-deep">
                {places.length}
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Изменить место — кнопка «Править» в его карточке (описание, цены,
            фото, китайское название, точка на карте).
          </p>
          <div className="mt-4 space-y-3">
            {places?.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-blush bg-card p-4 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-milk text-deep shadow-sm">
                    <CategoryIcon id={categoryId(p.category)} size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">
                      {categoryLabel(p.category)}
                    </p>
                  </div>
                  <form action={togglePlaceFree.bind(null, p.id, !p.is_free)}>
                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] items-center transition-transform active:scale-95"
                      title={p.is_free ? "Сделать платным" : "Сделать бесплатным"}
                    >
                      {p.is_free ? (
                        <Badge>Бесплатно</Badge>
                      ) : (
                        <Badge className="bg-blush">
                          <IconLock size={12} /> Платно
                        </Badge>
                      )}
                    </button>
                  </form>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-dashed border-blush pt-3">
                  <Button
                    href={`/admin/places/${p.id}`}
                    size="sm"
                    className="min-h-[44px] flex-1"
                  >
                    <IconPencil size={14} /> Править
                  </Button>
                  <Link
                    href={`/place/${placeSlug(p)}`}
                    title="Открыть страницу места"
                    aria-label={`Открыть страницу «${p.name}»`}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pastel bg-card text-deep transition-colors hover:border-accent"
                  >
                    <IconArrowRight size={18} />
                  </Link>
                  <ConfirmDelete id={p.id} name={p.name} />
                </div>
              </div>
            ))}
            {!places?.length && (
              <p className="text-sm text-muted">Мест пока нет.</p>
            )}
          </div>
          <div className="mt-6">
            <h3 className="mb-3 font-display text-lg font-bold">
              Добавить место
            </h3>
            {sanya && <PlaceForm cityId={sanya.id} />}
          </div>
        </section>

        {/* Города */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold">Города</h2>
          <p className="mt-1 text-sm text-muted">
            «Открыт» — город появляется на карте и убирается из блока «Скоро»
            на главной. «Скоро» — виден в блоке «Скоро». «Скрыт» — нигде не
            виден.
          </p>
          <div className="mt-4 space-y-2">
            {cities?.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-blush bg-card px-4 py-3 shadow-soft"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-milk text-xl shadow-sm">
                  {c.emoji || <IconPin size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted">{c.slug}</p>
                </div>
                <CityStatusSelect id={c.id} status={c.status} />
              </div>
            ))}
          </div>
          <form
            action={addCity}
            className="mt-4 flex flex-wrap items-end gap-3 rounded-card border border-blush bg-card p-4 shadow-soft"
          >
            <div className="w-full sm:w-auto">
              <label className="mb-1 block text-sm font-semibold">
                Адрес латиницей
              </label>
              <input
                name="slug"
                required
                placeholder="guilin"
                className="w-full rounded-2xl border-2 border-pastel bg-card px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-accent sm:w-40"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="mb-1 block text-sm font-semibold">
                Название
              </label>
              <input
                name="name"
                required
                placeholder="Гуйлинь"
                className="w-full rounded-2xl border-2 border-pastel bg-card px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-accent sm:w-44"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="mb-1 block text-sm font-semibold">Эмодзи</label>
              <input
                name="emoji"
                placeholder="🏞️"
                className="w-full rounded-2xl border-2 border-pastel bg-card px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-accent sm:w-24"
              />
            </div>
            <Button type="submit" size="sm" className="min-h-[44px] w-full sm:w-auto">
              Добавить город
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
