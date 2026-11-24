"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { claimDeviceSession } from "@/lib/session";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const nickname = String(form.get("nickname"));

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(
        signUpError.message.includes("already")
          ? "Такой email уже зарегистрирован — попробуй войти"
          : `Не получилось: ${signUpError.message}`
      );
      setLoading(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password }
    );

    if (signInError || !data.user) {
      setNotice("Почти готово! Подтверди email по письму и возвращайся");
      setLoading(false);
      return;
    }

    await claimDeviceSession(supabase, data.user.id);
    router.push("/account");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-2xl border-2 border-pastel bg-card px-4 py-3 font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-muted focus:border-accent";

  return (
    <>
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Регистрация
        </h1>
        <p className="mt-2 text-xl font-semibold text-accent">
          присоединяйся к клубу
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-card border border-blush bg-card p-6 shadow-soft"
      >
          <div>
            <label
              htmlFor="nickname"
              className="mb-1 block text-sm font-semibold"
            >
              Ник (будет на твоём водяном знаке)
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              maxLength={30}
              placeholder="например, Настя"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold"
            >
              Пароль (минимум 8 символов)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="придумай надёжный"
              className={inputClass}
            />
          </div>
          {error && (
            <p className="rounded-2xl bg-blush px-4 py-2 text-sm font-semibold text-deep">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-2xl bg-pastel px-4 py-2 text-sm font-semibold text-deep">
              {notice}
            </p>
          )}
          <Button type="submit" className="w-full">
            {loading ? "Создаю…" : "Зарегистрироваться"}
          </Button>
          <p className="text-center text-sm text-muted">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="font-semibold text-deep underline decoration-pastel underline-offset-4 hover:text-accent"
            >
              Войти
            </Link>
          </p>
      </form>
    </>
  );
}
