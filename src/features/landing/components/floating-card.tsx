import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FloatingCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  subtitle: string;
  className?: string;
  delay?: number;
}

export function FloatingCard({
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  className,
  delay = 0,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={
        "absolute z-10 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg " +
        (className ?? "")
      }
    >
      <span
        className={
          "flex size-8 shrink-0 items-center justify-center rounded-lg " +
          (iconClassName ?? "bg-accent text-primary")
        }
      >
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-xs font-semibold">{title}</span>
        <span className="block text-[11px] text-muted-foreground">{subtitle}</span>
      </span>
    </motion.div>
  );
}