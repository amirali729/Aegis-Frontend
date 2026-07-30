import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/config/routes";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert className="size-12 text-muted-foreground" />
      <div>
        <h1 className="text-xl font-semibold">You don&apos;t have access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You lack the permission required to view this page.
        </p>
      </div>
      <Button render={<Link to={ROUTES.dashboard} />}>Back to dashboard</Button>
    </div>
  );
}