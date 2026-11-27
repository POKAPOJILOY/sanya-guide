import { IconGift } from "./icons";
import Button from "./ui/Button";

export default function FreemiumBar() {
  return (
    <div className="border-t-2 border-dashed border-choco/15 bg-blush/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-6 text-center sm:justify-between sm:text-left">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <IconGift size={18} className="text-deep" /> Полная версия —{" "}
          <span className="text-deep">599 ₽</span> · доступ навсегда
        </p>
        <Button href="/register" size="sm">
          Разблокировать
        </Button>
      </div>
    </div>
  );
}
