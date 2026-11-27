"use client";

import { useRef, useState, useTransition } from "react";
import { uploadPlacePhoto } from "./actions";

export default function PhotoUrlInput({
  defaultValue,
  className,
}: {
  defaultValue?: string;
  className: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const result = await uploadPlacePhoto(fd);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if ("url" in result && result.url) {
        setUrl(result.url);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => fileRef.current?.click()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-pastel px-5 py-2.5 text-sm font-bold text-deep shadow-soft transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {pending ? "Загружаю…" : "📷 Загрузить фото"}
        </button>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Превью"
            className="h-24 w-24 rounded-2xl border border-blush object-cover"
          />
        )}
      </div>
      {error && <p className="text-sm font-semibold text-accent">{error}</p>}
      <input
        name="photo_url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="или вставь ссылку: https://…"
        className={className}
      />
    </div>
  );
}
