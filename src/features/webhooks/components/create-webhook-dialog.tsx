import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/forms/form";
import {
  createWebhookSchema,
  type CreateWebhookFormValues,
} from "@/features/webhooks/schemas/webhook.schemas";
import { useCreateWebhook } from "@/features/webhooks/mutations/use-webhook-mutations";
import { WebhookEventPicker } from "@/features/webhooks/components/webhook-event-picker";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";
import { getErrorMessage } from "@/shared/errors/get-error-message";

export function CreateWebhookDialog({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState<{ secret: string; warning: string } | null>(null);
  const createWebhook = useCreateWebhook(orgId);

  const form = useForm<CreateWebhookFormValues>({
    resolver: zodResolver(createWebhookSchema),
    defaultValues: {
      name: "",
      url: "",
      subscribedEvents: [],
    },
  });

  function onSubmit(values: CreateWebhookFormValues) {
    createWebhook.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        form.reset();
        setReveal({
          secret: data.secret,
          warning: data.warning,
        });
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button><Plus />Create Webhook</Button>} />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create webhook</DialogTitle>
            <DialogDescription>
              We'll send a signed POST request to your endpoint whenever a
              selected event happens.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              {createWebhook.isError && (
                <Alert variant="destructive">
                  <AlertDescription>{getErrorMessage(createWebhook.error)}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="e.g. User Events" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.example.com/webhooks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscribedEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Events</FormLabel>
                    <WebhookEventPicker selected={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createWebhook.isPending}>
                  {createWebhook.isPending && <Spinner />}
                  Create webhook
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {reveal && (
        <OneTimeSecretDialog
          open={Boolean(reveal)}
          onOpenChange={(isOpen) => !isOpen && setReveal(null)}
          title="Webhook created"
          label="Signing secret"
          secret={reveal.secret}
          warning={reveal.warning}
        />
      )}
    </>
  );
}
