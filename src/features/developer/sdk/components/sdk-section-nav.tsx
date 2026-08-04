import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "configuration", label: "Configuration" },
  { id: "api-credentials", label: "API Credentials" },
  { id: "framework-guides", label: "Framework Guides" },
  { id: "code-examples", label: "Code Examples" },
  { id: "playground", label: "Playground" },
  { id: "downloads", label: "Downloads" },
  { id: "documentation", label: "Documentation" },
];

export function SdkSectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-14 z-10 -mx-6 overflow-x-auto border-b border-border bg-background/95 px-6 backdrop-blur">
      <div className="flex w-max min-w-full gap-1">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "relative shrink-0 px-3 py-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
              active === section.id && "text-primary",
            )}
          >
            {section.label}
            {active === section.id && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary transition-all" />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}