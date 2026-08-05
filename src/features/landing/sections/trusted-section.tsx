import { Box, Boxes, Cpu, Layers, Rocket, Zap } from "lucide-react";

const LOGOS = [
  { name: "Acme Inc.", icon: Box },
  { name: "DevStack", icon: Boxes },
  { name: "PixelForge", icon: Layers },
  { name: "ShipFast", icon: Rocket },
  { name: "codebase", icon: Cpu },
  { name: "TinyStartups", icon: Zap },
];

export function TrustedSection() {
  return (
    <section className="border-y border-border bg-muted/40 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm text-muted-foreground">
          Trusted by developers building modern applications
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center gap-2 text-muted-foreground/60 grayscale transition-colors hover:text-foreground/70"
            >
              <logo.icon className="size-4" />
              <span className="text-sm font-semibold">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}