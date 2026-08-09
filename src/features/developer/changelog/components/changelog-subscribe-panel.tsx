import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "@/shared/lib/toast";

const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  securityAlerts: z.boolean(),
});

type SubscribeFormValues = z.infer<typeof subscribeSchema>;

export function ChangelogSubscribePanel() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "", securityAlerts: false },
  });

  function onSubmit() {
    // There's no newsletter/subscription endpoint on the backend yet.
    // Being upfront about that here rather than showing a fake "you're
    // subscribed" success state for something that didn't actually happen.
    toast("Email subscriptions aren't available yet — check back soon.");
    setSubmitted(true);
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">Stay in the loop</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Subscribe to get notified about new releases, features, and updates.
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-4" />
          </span>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
          <Input
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={form.watch("securityAlerts")}
              onCheckedChange={(checked) => form.setValue("securityAlerts", checked === true)}
            />
            Get important updates and security alerts
          </label>

          <Button type="submit" className="mt-1" disabled={submitted}>
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
