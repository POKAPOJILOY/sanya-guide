import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация — Санья Гид",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-12 md:py-16">
        <RegisterForm />
      </main>
    </>
  );
}
