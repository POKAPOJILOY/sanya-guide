import type { ReactNode } from "react";

export default function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-pastel px-3 py-1 text-xs font-bold text-deep ${className}`}
    >
      {children}
    </span>
  );
}
