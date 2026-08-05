import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FRAMEWORK_GUIDES } from "@/features/developer/sdk/constants/sdk-content";

export function FrameworkGuidesSection() {
  return (
    <Card id="framework-guides">
      <CardHeader>
        <CardTitle>4. Framework Guides</CardTitle>
        <CardDescription>Step-by-step guides for your favorite frameworks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FRAMEWORK_GUIDES.map((framework) => (
            <button
              key={framework}
              type="button"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                {framework.slice(0, 2)}
              </span>
              {framework}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}