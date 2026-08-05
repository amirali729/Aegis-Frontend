import { Link } from "react-router-dom";
import { KeyRound, ScrollText, DownloadCloud, LifeBuoy, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/config/routes";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { toast } from "@/shared/lib/toast";

interface QuickLink {
  icon: LucideIcon;
  label: string;
  description: string;
  href?: string;
  onClick?: () => void;
  permission?: string;
}

export function QuickLinksCard() {
  const user = useAuthStore((state) => state.user);

  const links: QuickLink[] = [
    {
      icon: KeyRound,
      label: "Manage API Keys",
      description: "Create and manage API keys",
      href: ROUTES.applications,
      permission: "apikey:view",
    },
    {
      icon: ScrollText,
      label: "View Audit Logs",
      description: "Monitor system activity",
      href: ROUTES.auditLogs,
      permission: "audit:view",
    },
    {
      icon: DownloadCloud,
      label: "Export Organization Data",
      description: "Download your organization data",
      onClick: () =>
        toast.info("Data export isn't available yet — check back soon."),
    },
    {
      icon: LifeBuoy,
      label: "Contact Support",
      description: "Get help from our team",
      href: "mailto:support@aegis.dev",
    },
  ];

  const visible = links.filter(
    (link) => !link.permission || can(user, link.permission),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {visible.map((link) => {
          const content = (
            <>
              <link.icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1">
                <span className="block text-sm font-medium">{link.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {link.description}
                </span>
              </span>
            </>
          );

          const className =
            "flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted";

          if (link.href) {
            return link.href.startsWith("mailto:") ? (
              <a key={link.label} href={link.href} className={className}>
                {content}
              </a>
            ) : (
              <Link key={link.label} to={link.href} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}