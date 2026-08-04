import { ArrowRight, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { DOCUMENTATION_LINKS } from "@/features/developer/sdk/constants/sdk-content";

export function DocumentationSection() {
  return (
    <Card id="documentation">
      <CardHeader>
        <CardTitle>8. Documentation</CardTitle>
        <CardDescription>Explore our docs and API reference.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DOCUMENTATION_LINKS.map((doc) => (
            <button
              key={doc.title}
              type="button"
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
            >
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.description}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}