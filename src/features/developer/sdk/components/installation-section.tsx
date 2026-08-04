import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { CodeBlock } from "@/features/developer/sdk/components/code-block";
import { PACKAGE_MANAGERS } from "@/features/developer/sdk/constants/sdk-content";

export function InstallationSection() {
  return (
    <Card id="installation">
      <CardHeader>
        <CardTitle>1. Installation</CardTitle>
        <CardDescription>
          Install the Aegis SDK using your preferred package manager.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Tabs defaultValue="npm">
          <TabsList>
            {PACKAGE_MANAGERS.map((pm) => (
              <TabsTrigger key={pm.id} value={pm.id}>
                {pm.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {PACKAGE_MANAGERS.map((pm) => (
            <TabsContent key={pm.id} value={pm.id}>
              <CodeBlock code={pm.command} />
            </TabsContent>
          ))}
        </Tabs>

        <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          The SDK works in Node.js (18+) and modern browsers.
        </p>
      </CardContent>
    </Card>
  );
}