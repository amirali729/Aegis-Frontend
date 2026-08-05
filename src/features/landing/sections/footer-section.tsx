import { Link } from "react-router-dom";
import { Github, ShieldCheck } from "lucide-react";

import { ROUTES } from "@/shared/config/routes";
import { appConfig } from "@/shared/config/app";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "SDK", href: ROUTES.developerSdk },
      { label: "Documentation", href: appConfig.documentationUrl, external: true },
      { label: "Changelog", href: ROUTES.developerChangelog },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Reference", href: ROUTES.developerApiReference },
      { label: "OpenAPI", href: ROUTES.developerOpenapi },
      { label: "Postman", href: ROUTES.developerPostman },
      { label: "GitHub", href: "https://github.com", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "mailto:support@aegis.dev" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function FooterSection() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to={ROUTES.home} className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="size-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold">{appConfig.name}</span>
            </Link>
            <p className="mt-3 max-w-52 text-sm text-muted-foreground">
              Secure authentication and identity infrastructure, built for
              developers.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : link.href.startsWith("#") || link.href.startsWith("mailto:") ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {appConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="size-4 hover:text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}