// Fil d'Ariane générique : "Accueil › Parcours › Module 1 › Leçon 1.1".
// Chaque élément a un libellé, et un lien optionnel (le dernier élément,
// la page actuelle, n'a pas de lien).

import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <span aria-hidden="true" className="text-foreground/30">
              ›
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-foreground/50 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
