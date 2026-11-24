"use client";

import { useState } from "react";

export default function PhotoUrlInput({
  defaultValue,
  className,
}: {
  defaultValue?: string;
  className: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");

  return (
    <div className="flex items-start gap-3">
      <input
        name="photo_url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://…"
        className={className}
      />
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Превью"
          className="h-24 w-24 shrink-0 rounded-2xl border border-blush object-cover"
        />
      )}
    </div>
  );
}
