import Button from "@/components/ui/Button";
import { IconPhone } from "@/components/icons";
import { claimSession } from "@/app/account/actions";
import LogoutButton from "@/app/account/LogoutButton";

export default function SessionConflict() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <span className="inline-flex text-deep">
        <IconPhone size={52} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
        Ты вошла с другого устройства
      </h1>
      <p className="mt-3 text-muted">
        Кажется, аккаунт открыт где-то ещё. Войти здесь и завершить другие
        сессии?
      </p>
      <form action={claimSession} className="mt-6">
        <Button type="submit" className="w-full">
          Да, войти здесь
        </Button>
      </form>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </main>
  );
}
