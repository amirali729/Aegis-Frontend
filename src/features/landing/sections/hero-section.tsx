import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, KeyRound, UserPlus, ScrollText, LogIn } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/config/routes";
import { appConfig } from "@/shared/config/app";
import { FloatingCard } from "@/features/landing/components/floating-card";
import { HeroDashboardPreview } from "@/features/landing/components/hero-dashboard-preview";

const BADGES = ["Open Source SDK", "TypeScript First", "Production Ready", "Free to Start"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--color-primary),transparent_86%),transparent)]"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" />
            Trusted Identity Infrastructure
          </span>

          <h1 className="mt-5 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            Secure Authentication
            <br />
            <span className="text-primary">Built for Developers.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Authentication, Organizations, RBAC, Sessions, API Keys, Audit
            Logs, multi-tenant architecture, and developer SDKs — all in one
            platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link to={ROUTES.signup} />}>
              Get Started
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={
                <a href={appConfig.documentationUrl} target="_blank" rel="noreferrer" />
              }
            >
              View Documentation
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-success" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <HeroDashboardPreview />

          <FloatingCard
            icon={LogIn}
            title="User Login"
            subtitle="2 minutes ago"
            className="-top-6 -right-4 hidden sm:flex"
            delay={0.4}
          />
          <FloatingCard
            icon={KeyRound}
            iconClassName="bg-warning/15 text-warning"
            title="API Key Created"
            subtitle="5 minutes ago"
            className="top-1/3 -left-8 hidden sm:flex"
            delay={0.7}
          />
          <FloatingCard
            icon={ScrollText}
            iconClassName="bg-primary/10 text-primary"
            title="Audit Log Generated"
            subtitle="1 hour ago"
            className="-bottom-6 left-8 hidden sm:flex"
            delay={1}
          />
          <FloatingCard
            icon={UserPlus}
            iconClassName="bg-success/15 text-success"
            title="Organization Invited"
            subtitle="1 hour ago"
            className="top-4 -right-10 hidden lg:flex"
            delay={1.3}
          />
        </motion.div>
      </div>
    </section>
  );
}