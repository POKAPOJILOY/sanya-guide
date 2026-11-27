"use client";

import { useTransition } from "react";
import { setCityStatus } from "./actions";

const statuses = [
  { id: "active", label: "Открыт" },
  { id: "coming_soon", label: "Скоро" },
  { id: "draft", label: "Скрыт" },
];

const statusStyles: Record<string, string> = {
  active: "border-pistachio bg-pistachioSoft text-choco",
  coming_soon: "border-butter bg-butterSoft text-choco",
  draft: "border-choco/20 bg-milk text-muted",
};

export default function CityStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => setCityStatus(id, e.target.value))
      }
      className={`min-h-[44px] w-full rounded-2xl border-2 px-4 py-2 text-sm font-bold outline-none transition-colors focus:border-accent disabled:opacity-50 sm:w-auto ${
        statusStyles[status] ?? statusStyles.draft
      }`}
    >
      {statuses.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
