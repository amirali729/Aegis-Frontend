import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { CodeBlock } from "@/features/developer/sdk/components/code-block";
import {
  CODE_EXAMPLES,
  CODE_EXAMPLE_RESOURCES,
} from "@/features/developer/sdk/constants/sdk-content";

export function CodeExamplesSection() {
  const [resource, setResource] = useState(CODE_EXAMPLE_RESOURCES[0]);
  const example = CODE_EXAMPLES[resource];

  return (
    <Card id="code-examples">
      <CardHeader>
        <CardTitle>5. Code Examples</CardTitle>
        <CardDescription>Common operations with the Aegis SDK.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {CODE_EXAMPLE_RESOURCES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setResource(key)}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                resource === key && "bg-primary/10 text-primary",
              )}
            >
              {key}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-medium">{example.label}</h4>
            <p className="text-sm text-muted-foreground">{example.description}</p>
          </div>
          <CodeBlock code={example.request} />
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Response</p>
            <CodeBlock code={example.response} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}