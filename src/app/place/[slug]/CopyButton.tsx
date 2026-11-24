"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "@/components/icons";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-pastel bg-card px-4 py-2 text-sm font-semibold text-deep shadow-soft transition-all duration-200 hover:border-accent"
    >
      {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
      {copied ? "Скопировано!" : "Копировать"}
    </button>
  );
}
