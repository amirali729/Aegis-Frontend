import { useRef, useState, useEffect, type ChangeEvent } from "react";
import { Camera, Copy } from "lucide-react";

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
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useProfilePreferencesStore } from "@/features/settings/store/profile-preferences";
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

export default function ProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const created = useFormattedDateTime(user?.createdAt);
  const { copy } = useCopyToClipboard();

  const {
    jobTitle,
    bio,
    avatarDataUrl,
    setJobTitle,
    setBio,
    setAvatarDataUrl,
  } = useProfilePreferencesStore();

  const [jobTitleDraft, setJobTitleDraft] = useState(jobTitle);
  const [bioDraft, setBioDraft] = useState(bio);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setJobTitleDraft(jobTitle), [jobTitle]);
  useEffect(() => setBioDraft(bio), [bio]);

  const dirty = jobTitleDraft !== jobTitle || bioDraft !== bio;

  function handleSave() {
    setJobTitle(jobTitleDraft);
    setBio(bioDraft);
    toast.success("Profile updated.");
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  const accountType = accountTypeFromPermissions(user?.permissions.length ?? 0);

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
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-16">
                  {avatarDataUrl && <AvatarImage src={avatarDataUrl} alt={user?.username} />}
                  <AvatarFallback className="text-lg">
                    {user ? initials(user.username) : "?"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                  aria-label="Change photo"
                >
                  <Camera className="size-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Upload New Photo
                </Button>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size of 2MB.
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
                  value={jobTitleDraft}
                  onChange={(e) => setJobTitleDraft(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Member since</Label>
                <Input readOnly value={user ? created.date : ""} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                maxLength={160}
                rows={3}
                placeholder="Tell us a little about yourself."
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {bioDraft.length}/160 characters.
              </p>
            </div>

            <div>
              <Button onClick={handleSave} disabled={!dirty}>
                Save Changes
              </Button>
            </div>
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
                    onClick={() => copy(user.id)}
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