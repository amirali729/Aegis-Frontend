import { ShieldCheck, Users, Building2, Box } from "lucide-react";

const MINI_STATS = [
  { icon: Users, label: "Users", value: "12,543", color: "text-primary" },
  { icon: Building2, label: "Organizations", value: "32", color: "text-success" },
  { icon: Box, label: "Applications", value: "18", color: "text-warning" },
];

const LOGIN_ACTIVITY = [40, 55, 45, 62, 50, 70, 58, 66, 52, 60, 74, 65];

export function HeroDashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary">
          <ShieldCheck className="size-3.5 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold">Aegis</span>
        <span className="ml-auto text-xs text-muted-foreground">Dashboard</span>
      </div>

      <div className="flex">
        <div className="hidden w-32 shrink-0 flex-col gap-1 border-r border-border p-3 sm:flex">
          {["Dashboard", "Organizations", "Users", "Applications", "Sessions"].map(
            (item, i) => (
              <div
                key={item}
                className={
                  "truncate rounded-md px-2 py-1.5 text-[11px] " +
                  (i === 0
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground")
                }
              >
                {item}
              </div>
            ),
          )}
        </div>

        <div className="flex-1 p-4">
          <p className="mb-3 text-sm font-semibold">Welcome back, Amir 👋</p>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {MINI_STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-2">
                <stat.icon className={"mb-1 size-3.5 " + stat.color} />
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border p-2">
              <p className="mb-2 text-[10px] font-medium text-muted-foreground">
                Login Activity
              </p>
              <svg viewBox="0 0 120 40" className="h-10 w-full">
                <polyline
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={LOGIN_ACTIVITY.map(
                    (v, i) => `${i * (120 / (LOGIN_ACTIVITY.length - 1))},${40 - v * 0.5}`,
                  ).join(" ")}
                />
              </svg>
            </div>
            <div className="flex items-center justify-center rounded-lg border border-border p-2">
              <svg viewBox="0 0 36 36" className="size-14">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-muted)" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="4"
                  strokeDasharray="72 100"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="4"
                  strokeDasharray="10 100"
                  strokeDashoffset="-72"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}