import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-blush bg-card p-6 shadow-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      {children}
    </div>
  );
}
