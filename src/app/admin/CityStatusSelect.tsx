"use client";

import { useTransition } from "react";
import { setCityStatus } from "./actions";

const statuses = [
  { id: "active", label: "active" },
  { id: "coming_soon", label: "coming_soon" },
  { id: "draft", label: "draft" },
];

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
      className="rounded-full border-2 border-pastel bg-card px-3 py-1 text-sm font-semibold text-deep outline-none transition-colors focus:border-accent disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
