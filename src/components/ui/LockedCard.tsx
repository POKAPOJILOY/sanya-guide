import type { ReactNode } from "react";
import { IconLock } from "@/components/icons";
import Button from "./Button";

export default function LockedCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-card border border-blush bg-card shadow-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none p-6 opacity-70 blur-[8px]"
      >
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/40 p-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pastel text-deep shadow-soft">
          <IconLock size={26} />
        </span>
        <p className="font-display text-lg font-bold text-ink">{title}</p>
        <p className="text-sm font-semibold text-muted">
          Доступно в полной версии
        </p>
        <Button href="#" size="sm">
          Разблокировать
        </Button>
      </div>
    </div>
  );
}
