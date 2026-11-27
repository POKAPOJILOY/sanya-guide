import { IconCamera, IconHeart } from "@/components/icons";

const siteLinks = [
  { href: "/map", label: "Карта" },
  { href: "/#course", label: "Курс" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-dashed border-choco/15 bg-blush/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center">
        <p className="flex items-center gap-2 font-display text-2xl font-bold text-deep">
          Санья Гид
          <IconHeart size={18} className="text-accent" />
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Курс-путеводитель по Китаю от Сабины: карта, гайды и чек-листы,
          которые всегда с собой.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted">
          {siteLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-deep"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/saiiko_sama"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-deep"
          >
            <IconCamera size={15} /> Instagram
          </a>
        </nav>
        <p className="w-full max-w-md border-t border-dashed border-choco/15 pt-5 text-xs text-muted">
          © {new Date().getFullYear()} Санья Гид. Сделано с любовью к
          путешествиям.
        </p>
      </div>
    </footer>
  );
}
