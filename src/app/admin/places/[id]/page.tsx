import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import PlaceForm from "../../PlaceForm";

export const metadata: Metadata = {
  title: "Редактировать место — Админка",
};

export const dynamic = "force-dynamic";

export default async function EditPlacePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/login");

  const admin = createAdminClient();
  const { data: place } = await admin
    .from("places")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!place) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          {place.name}
        </h1>
        <p className="mt-1 text-lg font-semibold text-accent">
          редактируем
        </p>
        <div className="mt-6">
          <PlaceForm place={place} />
        </div>
        <div className="mt-4">
          <Button href="/admin" variant="secondary" size="sm">
            ← Назад в админку
          </Button>
        </div>
      </main>
    </>
  );
}
