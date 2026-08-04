import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  FRAMEWORKS,
  SDK_RELEASED_AT,
  SDK_VERSION,
  WHATS_NEW,
} from "@/features/developer/sdk/constants/sdk-content";

export function SdkOverviewSection() {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Code2 className="size-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">Aegis SDK</h2>
                <Badge variant="outline">Latest {SDK_VERSION}</Badge>
              </div>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                The official SDKs make it easy to add authentication, user
                management, and organization features to your app.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FRAMEWORKS.map((framework) => (
              <Badge key={framework} variant="secondary">
                {framework}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button render={<a href="#installation" />}>
              Quick Start
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              render={<Link to="/developer/api-reference" />}
            >
              View Documentation
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">What&apos;s new in {SDK_VERSION}</h3>
            <Link
              to="/developer/changelog"
              className="text-xs font-medium text-primary hover:underline"
            >
              View changelog
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {WHATS_NEW.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Released on {SDK_RELEASED_AT}</p>
        </div>
      </CardContent>
    </Card>
  );
}