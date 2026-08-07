import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  updateWebhookSchema,
  type UpdateWebhookFormValues,
} from "@/features/webhooks/schemas/webhook.schemas";
import { useUpdateWebhook } from "@/features/webhooks/mutations/use-webhook-mutations";
import { WebhookEventPicker } from "@/features/webhooks/components/webhook-event-picker";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { Webhook } from "@/features/webhooks/types/webhook.types";

export function EditWebhookDialog({
  applicationId,
  webhook,
  open,
  onOpenChange,
}: {
  applicationId: string;
  webhook: Webhook;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateWebhook = useUpdateWebhook(applicationId);

  const form = useForm<UpdateWebhookFormValues>({
    resolver: zodResolver(updateWebhookSchema),
    defaultValues: {
      name: webhook.name,
      endpointUrl: webhook.endpointUrl,
      events: webhook.events,
    },
  });

  // Re-sync when a different row's dialog opens (the form instance is
  // shared per-row-mount, so this covers switching webhooks quickly).
  useEffect(() => {
    if (open) {
      form.reset({
        name: webhook.name,
        endpointUrl: webhook.endpointUrl,
        events: webhook.events,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, webhook.id]);

  function onSubmit(values: UpdateWebhookFormValues) {
    updateWebhook.mutate(
      { webhookId: webhook.id, body: values },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit webhook</DialogTitle>
          <DialogDescription>Update the endpoint or event subscriptions.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {updateWebhook.isError && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage(updateWebhook.error)}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpointUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="events"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Events</FormLabel>
                  <WebhookEventPicker
                    selected={field.value ?? []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={updateWebhook.isPending}>
                {updateWebhook.isPending && <Spinner />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}