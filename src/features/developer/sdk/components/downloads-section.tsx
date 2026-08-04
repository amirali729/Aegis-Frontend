import { Download } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { DOWNLOADS } from "@/features/developer/sdk/constants/sdk-content";

export function DownloadsSection() {
  return (
    <Card id="downloads">
      <CardHeader>
        <CardTitle>7. Downloads</CardTitle>
        <CardDescription>Everything you need to build with Aegis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DOWNLOADS.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
                {item.iconLabel}
              </span>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.version}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-auto w-fit">
                <Download />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}