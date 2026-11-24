import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "lg";
  type?: "button" | "submit";
  className?: string;
};

const variants = {
  primary:
    "bg-gradient-to-r from-accent to-deep text-white shadow-soft hover:shadow-lift",
  secondary:
    "border-2 border-pastel bg-card text-deep shadow-soft hover:border-accent hover:shadow-lift",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "lg",
  type = "button",
  className = "",
}: ButtonProps) {
  const classNames = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames}>
      {children}
    </button>
  );
}
