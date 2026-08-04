import { UserCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useFormattedDateTime } from "@/shared/timezone/format";

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export default function ProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const created = useFormattedDateTime(user?.createdAt);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your account information. Contact an administrator to change your
            username or email.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">
                {user ? initials(user.username) : <UserCircle className="size-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">{user?.username}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Username</Label>
              <Input readOnly value={user?.username ?? ""} />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input readOnly value={user?.email ?? ""} />
            </div>
            <div className="grid gap-1.5">
              <Label>Member since</Label>
              <Input readOnly value={user ? created.date : ""} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}