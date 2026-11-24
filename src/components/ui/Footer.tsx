const links = [
  { href: "#", label: "Политика конфиденциальности" },
  { href: "#", label: "Оферта" },
  { href: "https://www.instagram.com/saiiko_sama", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-blush bg-blush/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center">
        <p className="font-display text-2xl font-bold text-deep">Санья Гид</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Санья Гид. Сделано с любовью к
          путешествиям.
        </p>
      </div>
    </footer>
  );
}
