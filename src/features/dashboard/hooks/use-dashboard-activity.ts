import { useMemo } from "react";
import { format, startOfDay, subDays } from "date-fns";

import { useAuditLogs } from "@/features/audit-logs/queries/use-audit-logs";

const DAYS = 7;

export function useDashboardActivity(enabled = true) {
  const auditLogsQuery = useAuditLogs({ page: 1, limit: 100 }, enabled);

  const derived = useMemo(() => {
    const logs = auditLogsQuery.data?.logs ?? [];

    const dayBuckets = Array.from({ length: DAYS }, (_, index) => {
      const date = startOfDay(subDays(new Date(), DAYS - 1 - index));
      return { date, label: format(date, "MMM d"), count: 0 };
    });

    let successCount = 0;
    let failedCount = 0;

    for (const log of logs) {
      const logDay = startOfDay(new Date(log.createdAt)).getTime();
      const bucket = dayBuckets.find((b) => b.date.getTime() === logDay);
      if (bucket) bucket.count += 1;

      if (log.success) successCount += 1;
      else failedCount += 1;
    }

    return {
      dailyActivity: dayBuckets.map(({ label, count }) => ({ label, count })),
      outcomeBreakdown: [
        { name: "Successful", value: successCount, color: "var(--success)" },
        { name: "Failed", value: failedCount, color: "var(--destructive)" },
      ],
      recentLogs: logs.slice(0, 6),
      totalEvents: logs.length,
    };
  }, [auditLogsQuery.data]);

  return {
    ...derived,
    total: auditLogsQuery.data?.total,
    isPending: auditLogsQuery.isPending,
    isError: auditLogsQuery.isError,
    error: auditLogsQuery.error,
    refetch: auditLogsQuery.refetch,
  };
}