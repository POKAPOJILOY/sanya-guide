import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Вход — Санья Гид",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <LoginForm />
      </main>
    </>
  );
}
