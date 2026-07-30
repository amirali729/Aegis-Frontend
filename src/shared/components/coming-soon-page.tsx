import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            This section hasn&apos;t been built out yet.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}