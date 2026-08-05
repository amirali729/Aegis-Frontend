import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/config/routes";

interface AuditPreferencesState {
  retentionDays: string;
  logSuccessfulReads: boolean;
  setRetentionDays: (value: string) => void;
  setLogSuccessfulReads: (value: boolean) => void;
}

const useAuditPreferencesStore = create<AuditPreferencesState>()(
  persist(
    (set) => ({
      retentionDays: "90",
      logSuccessfulReads: false,
      setRetentionDays: (retentionDays) => set({ retentionDays }),
      setLogSuccessfulReads: (logSuccessfulReads) => set({ logSuccessfulReads }),
    }),
    { name: "aegis:audit-preferences" },
  ),
);

export default function AuditLogsSettingsPage() {
  const { retentionDays, logSuccessfulReads, setRetentionDays, setLogSuccessfulReads } =
    useAuditPreferencesStore();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Retention</CardTitle>
          <CardDescription>
            Control how long audit log entries are kept.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Retention period</p>
              <p className="text-xs text-muted-foreground">
                Entries older than this are eligible for deletion.
              </p>
            </div>
            <Select value={retentionDays} onValueChange={(v) => v && setRetentionDays(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium">Log successful reads</p>
              <p className="text-xs text-muted-foreground">
                Record read-only (GET) actions, not just writes. Increases log volume.
              </p>
            </div>
            <Switch checked={logSuccessfulReads} onCheckedChange={setLogSuccessfulReads} />
          </div>

          <p className="text-xs text-muted-foreground">
            These preferences are saved to this device — actual retention
            enforcement requires backend support that isn&apos;t built yet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browse Logs</CardTitle>
          <CardDescription>
            View every actor-attributed event across your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link to={ROUTES.auditLogs} />}>
            <ScrollText />
            Open Audit Logs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}