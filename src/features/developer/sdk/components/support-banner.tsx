import { BookOpen, LifeBuoy } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { appConfig } from "@/shared/config/app";

export function SupportBanner() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <LifeBuoy className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Need help integrating?</p>
            <p className="text-sm text-muted-foreground">
              Check out our guides or contact our developer support.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" render={<a href={appConfig.documentationUrl} target="_blank" rel="noreferrer" />}>
            <BookOpen />
            View Documentation
          </Button>
          <Button>
            <LifeBuoy />
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}