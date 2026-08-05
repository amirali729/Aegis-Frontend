import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import { appConfig } from "@/shared/config/app";
import { useAuthStore } from "@/features/auth/store/auth-store";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Developers", href: "#developer-experience" },
  { label: "SDK", href: ROUTES.developerSdk },
  { label: "Documentation", href: appConfig.documentationUrl, external: true },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <Link to={ROUTES.home} className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="size-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold">{appConfig.name}</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            render={
              <a
                href="https://github.com/amirali729/Aegis"
                target="_blank"
                rel="noreferrer"
                aria-label="Aegis on GitHub"
              />
            }
          >
            <Github />
          </Button>

          {status === "authenticated" ? (
            <Button render={<Link to={ROUTES.dashboard} />}>Dashboard</Button>
          ) : (
            <>
              <Button variant="outline" render={<Link to={ROUTES.login} />}>
                Log in
              </Button>
              <Button render={<Link to={ROUTES.signup} />}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}