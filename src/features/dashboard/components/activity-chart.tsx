import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface ActivityChartProps {
  data: { label: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Events"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#activityFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}