import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Terminal, Users } from "lucide-react";

const STEPS = [
  {
    icon: LayoutDashboard,
    title: "Create Application",
    description: "Create a new application in your Aegis dashboard and get your credentials.",
    preview: (
      <div className="rounded-lg border border-border bg-background p-2">
        <div className="mb-1.5 h-2 w-16 rounded bg-primary/30" />
        <div className="h-1.5 w-24 rounded bg-muted" />
        <div className="mt-1.5 h-1.5 w-20 rounded bg-muted" />
      </div>
    ),
  },
  {
    icon: Terminal,
    title: "Install SDK",
    description: "Install the SDK using your preferred package manager.",
    preview: (
      <div className="rounded-lg border border-white/10 bg-[#0d1117] p-2 font-mono text-[10px] text-white/80">
        pnpm add @aegis/sdk
      </div>
    ),
  },
  {
    icon: Users,
    title: "Authenticate Users",
    description: "Start authenticating users and managing your application.",
    preview: (
      <div className="rounded-lg border border-border bg-background p-2">
        <div className="flex items-center gap-1.5">
          <div className="size-4 rounded-full bg-primary/30" />
          <div className="h-1.5 w-16 rounded bg-muted" />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="size-4 rounded-full bg-success/30" />
          <div className="h-1.5 w-14 rounded bg-muted" />
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            How it works
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Integrate Aegis in 3 Simple Steps
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <step.icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.preview}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className="hidden items-center justify-center lg:flex">
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}