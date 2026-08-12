import { useState, useEffect } from "react";
import { Copy } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useProfile } from "@/features/settings/queries/use-settings";
import { useUpdateProfile } from "@/features/settings/mutations/use-settings-actions";
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { toast } from "@/shared/lib/toast";
import { SecurityOverviewCard } from "@/features/settings/components/security-overview-card";
import { RecentActivityCard } from "@/features/settings/components/recent-activity-card";

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function accountTypeFromPermissions(permissionCount: number) {
  if (permissionCount >= 20) return "Platform Owner";
  if (permissionCount >= 5) return "Administrator";
  return "Member";
}

interface FormState {
  jobTitle: string;
  bio: string;
  avatarUrl: string;
  company: string;
  website: string;
  location: string;
}

const EMPTY_FORM: FormState = {
  jobTitle: "",
  bio: "",
  avatarUrl: "",
  company: "",
  website: "",
  location: "",
};

export default function ProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const created = useFormattedDateTime(user?.createdAt);
  const { copy } = useCopyToClipboard();

  const profileQuery = useProfile();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [dirty, setDirty] = useState(false);

  // Hydrate the draft from the server once it loads. Only re-syncs
  // when we're not mid-edit, so a background refetch can't clobber
  // what the user is typing.
  useEffect(() => {
    if (!profileQuery.data || dirty) return;
    const p = profileQuery.data;
    setForm({
      jobTitle: p.jobTitle ?? "",
      bio: p.bio ?? "",
      avatarUrl: p.avatarUrl ?? "",
      company: p.company ?? "",
      website: p.website ?? "",
      location: p.location ?? "",
    });
  }, [profileQuery.data, dirty]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function handleSave() {
    updateProfile.mutate(
      {
        jobTitle: form.jobTitle || undefined,
        bio: form.bio || undefined,
        avatarUrl: form.avatarUrl || undefined,
        company: form.company || undefined,
        website: form.website || undefined,
        location: form.location || undefined,
      },
      { onSuccess: () => setDirty(false) },
    );
  }

  const accountType = accountTypeFromPermissions(user?.permissions.length ?? 0);
  const isLoading = profileQuery.isLoading;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="flex flex-col gap-6 xl:col-span-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and how others see you.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : profileQuery.isError ? (
              <p className="text-sm text-destructive">
                Couldn&apos;t load your profile. Try refreshing the page.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    {form.avatarUrl && (
                      <AvatarImage src={form.avatarUrl} alt={user?.username} />
                    )}
                    <AvatarFallback className="text-lg">
                      {user ? initials(user.username) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 gap-1.5">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      placeholder="https://example.com/avatar.png"
                      value={form.avatarUrl}
                      onChange={(e) => setField("avatarUrl", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Link to an image — direct file upload isn&apos;t
                      supported by the backend yet, only a URL.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>Username</Label>
                    <Input readOnly value={user?.username ?? ""} />
                    <p className="text-xs text-muted-foreground">
                      Contact an administrator to change your username.
                    </p>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Email Address</Label>
                    <Input readOnly value={user?.email ?? ""} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g. Platform Engineer"
                      value={form.jobTitle}
                      onChange={(e) => setField("jobTitle", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="e.g. Acme Inc."
                      value={form.company}
                      onChange={(e) => setField("company", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://example.com"
                      value={form.website}
                      onChange={(e) => setField("website", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Karachi, Pakistan"
                      value={form.location}
                      onChange={(e) => setField("location", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label>Member since</Label>
                    <Input readOnly value={user ? created.date : ""} />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    maxLength={500}
                    rows={3}
                    placeholder="Tell us a little about yourself."
                    value={form.bio}
                    onChange={(e) => setField("bio", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {form.bio.length}/500 characters.
                  </p>
                </div>

                <div>
                  <Button
                    onClick={handleSave}
                    disabled={!dirty || updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              View your account and role information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="truncate font-mono text-sm">{user?.id}</p>
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      copy(user.id);
                      toast.success("Copied.");
                    }}
                    aria-label="Copy user ID"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Account Type</p>
              <Badge variant="secondary" className="mt-1">
                {accountType}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="mt-1 text-sm">{user ? created.date : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Permissions</p>
              <p className="mt-1 text-sm">{user?.permissions.length ?? 0} granted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <SecurityOverviewCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}
