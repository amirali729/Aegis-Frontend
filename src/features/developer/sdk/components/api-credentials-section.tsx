import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, KeyRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { apiConfig } from "@/shared/config/api";
import { useApplications } from "@/features/applications/queries/use-applications";

function CopyField({ label, value }: { label: string; value: string }) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input readOnly value={value} className="font-mono text-xs" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Copy ${label}`}
          onClick={() => copy(value)}
        >
          {copied ? <Check className="text-emerald-600" /> : <Copy />}
        </Button>
      </div>
    </div>
  );
}

export function ApiCredentialsSection() {
  const applicationsQuery = useApplications();
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const applications = applicationsQuery.data ?? [];
  const selected = applications.find((app) => app.id === selectedId) ?? applications[0];

  return (
    <Card id="api-credentials">
      <CardHeader>
        <CardTitle>3. API Credentials</CardTitle>
        <CardDescription>Use these credentials to configure your SDK.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {applicationsQuery.isPending && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {applicationsQuery.isSuccess && applications.length === 0 && (
          <EmptyState
            icon={KeyRound}
            title="No applications yet"
            description="Create an application to get real credentials here."
            action={
              <Button size="sm" render={<Link to="/applications" />}>
                Create application
              </Button>
            }
          />
        )}

        {applicationsQuery.isSuccess && applications.length > 0 && selected && (
          <>
            {applications.length > 1 && (
              <div className="grid gap-1.5">
                <Label>Application</Label>
                <Select
                  value={selected.id}
                  onValueChange={(value) => value && setSelectedId(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <CopyField label="Client ID" value={selected.clientId} />

            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Badge
                variant={selected.isActive ? "success" : "secondary"}
                className="w-fit"
              >
                {selected.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <CopyField label="API Base URL" value={apiConfig.baseUrl} />
          </>
        )}

        <Button
          variant="link"
          className="w-fit px-0"
          render={<Link to="/applications" />}
        >
          Manage Applications →
        </Button>
      </CardContent>
    </Card>
  );
}