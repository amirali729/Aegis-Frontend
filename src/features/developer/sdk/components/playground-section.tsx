import { useState } from "react";
import { Play } from "lucide-react";

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
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Spinner } from "@/shared/components/ui/spinner";
import { CodeBlock } from "@/features/developer/sdk/components/code-block";
import { httpClient } from "@/shared/api/axios";
import { getErrorMessage } from "@/shared/errors/get-error-message";

const ENDPOINTS = [
  { id: "applications", label: "applications.list()", path: "/applications" },
  { id: "organizations", label: "organizations.list()", path: "/organizations" },
  { id: "sessions", label: "sessions.list()", path: "/sessions" },
  { id: "roles", label: "roles.list()", path: "/roles" },
  { id: "permissions", label: "permissions.list()", path: "/permissions" },
] as const;

export function PlaygroundSection() {
  const [endpointId, setEndpointId] = useState<string>(ENDPOINTS[0].id);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("request");

  const endpoint = ENDPOINTS.find((item) => item.id === endpointId) ?? ENDPOINTS[0];

  async function handleRun() {
    setIsLoading(true);
    setTab("response");
    try {
      const result = await httpClient.get(endpoint.path);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: getErrorMessage(error) }, null, 2));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card id="playground">
      <CardHeader>
        <CardTitle>6. Playground</CardTitle>
        <CardDescription>Try the SDK in our interactive playground.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Select value={endpointId} onValueChange={(value) => value && setEndpointId(value)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENDPOINTS.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading ? <Spinner /> : <Play />}
            Run
          </Button>
        </div>

        <Tabs value={tab} onValueChange={(value) => value && setTab(value)}>
          <TabsList>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          <TabsContent value="request">
            <CodeBlock code={`await aegis.${endpoint.label}`} />
          </TabsContent>
          <TabsContent value="response">
            {response ? (
              <CodeBlock code={response} />
            ) : (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Click Run to send a real request using your session.
              </p>
            )}
          </TabsContent>
        </Tabs>

        <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          This playground sends real, authenticated requests to your Aegis backend using
          your current session — nothing here is simulated.
        </p>
      </CardContent>
    </Card>
  );
}