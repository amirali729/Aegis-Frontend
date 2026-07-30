import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/forms/form";
import {
  createApplicationSchema,
  type CreateApplicationFormValues,
} from "@/features/applications/schemas/application.schemas";
import { useCreateApplication } from "@/features/applications/mutations/use-create-application";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";

export function CreateApplicationDialog() {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState<{
    clientId: string;
    clientSecret: string;
    warning: string;
  } | null>(null);
  const createApplication = useCreateApplication();

  const form = useForm<CreateApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      name: "",
      allowedOrigins: [],
      redirectUris: [],
      accessTokenTTL: "15m",
      refreshTokenTTL: "7d",
    },
  });

  function onSubmit(values: CreateApplicationFormValues) {
    createApplication.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        form.reset();
        setReveal({
          clientId: data.clientId,
          clientSecret: data.clientSecret,
          warning: data.warning,
        });
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button>
              <Plus />
              New application
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create application</DialogTitle>
            <DialogDescription>
              Represents a web app, mobile app, or backend that integrates
              with Aegis.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              {createApplication.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {getErrorMessage(createApplication.error)}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowedOrigins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed origins</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"https://app.example.com\nhttps://staging.example.com"}
                        value={field.value.join("\n")}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>One origin per line.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="redirectUris"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URIs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"https://app.example.com/callback"}
                        value={field.value.join("\n")}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>One URI per line.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accessTokenTTL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access token TTL</FormLabel>
                      <FormControl>
                        <Input placeholder="15m" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="refreshTokenTTL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh token TTL</FormLabel>
                      <FormControl>
                        <Input placeholder="7d" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createApplication.isPending}>
                  {createApplication.isPending && <Spinner />}
                  Create application
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
          title="Application created"
          label="Client secret"
          secret={reveal.clientSecret}
          warning={reveal.warning}
        />
      )}
    </>
  );
}