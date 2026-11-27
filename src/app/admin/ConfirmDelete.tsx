"use client";

import { useTransition } from "react";
import { IconTrash } from "@/components/icons";
import { deletePlace } from "./actions";

export default function ConfirmDelete({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Удалить «${name}»? Это навсегда!`)) {
          startTransition(() => deletePlace(id));
        }
      }}
      title={`Удалить «${name}»`}
      aria-label={`Удалить «${name}»`}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pastel bg-card text-deep transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {pending ? "…" : <IconTrash size={18} />}
    </button>
  );
}
