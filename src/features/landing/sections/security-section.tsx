import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { SECURITY_FEATURES } from "@/features/landing/constants/content";

export function SecuritySection() {
  return (
    <section className="bg-[#0b0d14] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <ShieldCheck className="size-3.5" />
            Security
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built with Security First
          </h2>
          <p className="mt-3 text-white/60">
            Every layer of Aegis is designed with production security in mind.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SECURITY_FEATURES.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: (index % 4) * 0.05 }}
              className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_0_24px_-6px_var(--color-primary)]"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-sm font-medium text-white/85">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}