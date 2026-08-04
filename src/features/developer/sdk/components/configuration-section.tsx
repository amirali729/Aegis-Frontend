import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CodeBlock } from "@/features/developer/sdk/components/code-block";
import { CONFIGURATION_SNIPPETS } from "@/features/developer/sdk/constants/sdk-content";

type Language = keyof typeof CONFIGURATION_SNIPPETS;

export function ConfigurationSection() {
  const [language, setLanguage] = useState<Language>("TypeScript");

  return (
    <Card id="configuration">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>2. Configuration</CardTitle>
          <CardDescription>
            Initialize the SDK with your application credentials.
          </CardDescription>
        </div>
        <Select
          value={language}
          onValueChange={(value) => value && setLanguage(value as Language)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TypeScript">TypeScript</SelectItem>
            <SelectItem value="JavaScript">JavaScript</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <CodeBlock code={CONFIGURATION_SNIPPETS[language]} language={language} />
        <p className="text-xs text-muted-foreground">
          Get your Client ID from the{" "}
          <Link to="#api-credentials" className="text-primary hover:underline">
            API Credentials
          </Link>{" "}
          section.
        </p>
      </CardContent>
    </Card>
  );
}