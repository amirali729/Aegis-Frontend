import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const SERVICES = [
  "Authentication Service",
  "API Service",
  "Email Service",
  "Database",
  "Storage",
];

export function SystemStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-success" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm font-medium text-success">All Systems Operational</p>
        <div className="flex flex-col gap-2">
          {SERVICES.map((service) => (
            <div key={service} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{service}</span>
              <span className="text-xs font-medium text-success">Operational</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}