import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/config/routes";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Compass className="size-12 text-muted-foreground" />
      <div>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button render={<Link to={ROUTES.dashboard} />}>Back to dashboard</Button>
    </div>
  );
}