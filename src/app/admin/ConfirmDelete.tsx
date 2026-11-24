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
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-pastel px-3 py-1 text-sm font-semibold text-deep transition-colors hover:border-accent disabled:opacity-50"
    >
      {pending ? (
        "…"
      ) : (
        <>
          <IconTrash size={14} /> Удалить
        </>
      )}
    </button>
  );
}
