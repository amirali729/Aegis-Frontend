import { motion } from "framer-motion";

import { FEATURES } from "@/features/landing/constants/content";

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Features
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything You Need
        </h2>
        <p className="mt-3 text-muted-foreground">
          Everything required to build secure authentication and identity
          infrastructure into your application.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: (index % 3) * 0.06 }}
            className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary transition-transform group-hover:scale-105">
              <feature.icon className="size-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}