import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/config/routes";
import { appConfig } from "@/shared/config/app";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_100%_at_50%_50%,color-mix(in_oklch,var(--color-primary),transparent_88%),transparent)]"
      />
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Start Building Today
        </h2>
        <p className="mt-3 text-muted-foreground">
          Integrate production-ready authentication into your application
          within minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link to={ROUTES.signup} />}>
            Get Started
            <ArrowRight />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href={appConfig.documentationUrl} target="_blank" rel="noreferrer" />}
          >
            Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}