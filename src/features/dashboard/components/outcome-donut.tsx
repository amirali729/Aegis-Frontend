import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface OutcomeDonutProps {
  data: { name: string; value: number; color: string }[];
  total: number;
  unitLabel?: string;
}

export function OutcomeDonut({ data, total, unitLabel = "events" }: OutcomeDonutProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={62}
              paddingAngle={total > 0 ? 3 : 0}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums">{total}</span>
          <span className="text-[11px] text-muted-foreground">{unitLabel}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-medium tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}