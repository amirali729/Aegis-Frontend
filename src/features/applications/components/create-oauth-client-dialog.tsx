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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
  createOAuthClientSchema,
  type CreateOAuthClientFormValues,
} from "@/features/applications/schemas/application.schemas";
import { useCreateOAuthClient } from "@/features/applications/mutations/use-oauth-clients";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";

export function CreateOAuthClientDialog({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState<{ clientSecret: string; warning: string } | null>(
    null,
  );
  const createOAuthClient = useCreateOAuthClient(applicationId);

  const form = useForm<CreateOAuthClientFormValues>({
    resolver: zodResolver(createOAuthClientSchema),
    defaultValues: {
      name: "",
      redirectUris: [],
      clientType: "confidential",
      scopes: ["openid", "profile", "email"],
    },
  });

  function onSubmit(values: CreateOAuthClientFormValues) {
    createOAuthClient.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        form.reset();
        if (data.clientSecret) {
          setReveal({
            clientSecret: data.clientSecret,
            warning: data.warning ?? "This secret won't be shown again.",
          });
        }
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button variant="outline" size="sm">
              <Plus />
              New OAuth client
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create OAuth client</DialogTitle>
            <DialogDescription>
              Lets a third-party app authenticate users through Aegis via
              OAuth 2.1 (PKCE required, S256 only).
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              {createOAuthClient.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {getErrorMessage(createOAuthClient.error)}
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
                      <Input autoFocus placeholder="e.g. Mobile App" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client type</FormLabel>
                    <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confidential">
                          Confidential (server-side apps — gets a secret)
                        </SelectItem>
                        <SelectItem value="public">
                          Public (SPAs, mobile apps — no secret)
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder={"https://app.example.com/auth/callback"}
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

              <FormField
                control={form.control}
                name="scopes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scopes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="openid profile email"
                        value={field.value.join(" ")}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value.split(/\s+/).filter(Boolean),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>Space-separated scope names.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createOAuthClient.isPending}>
                  {createOAuthClient.isPending && <Spinner />}
                  Create OAuth client
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
          title="OAuth client created"
          label="Client secret"
          secret={reveal.clientSecret}
          warning={reveal.warning}
        />
      )}
    </>
  );
}