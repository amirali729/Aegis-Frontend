import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back{user ? `, ${user.username}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your Aegis workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard widgets coming soon</CardTitle>
          <CardDescription>
            This page is a placeholder — applications, users, and audit-log
            summaries will be built out here in the next pass.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}