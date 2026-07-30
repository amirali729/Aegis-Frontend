import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePermissions } from "@/features/permissions/queries/use-permissions";

export function PermissionPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const permissionsQuery = usePermissions();

  function toggle(id: string, checked: boolean) {
    onChange(
      checked
        ? [...selectedIds, id]
        : selectedIds.filter((selectedId) => selectedId !== id),
    );
  }

  if (permissionsQuery.isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    );
  }

  if (permissionsQuery.isError || !permissionsQuery.data.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No permissions available yet — create some on the Permissions page
        first.
      </p>
    );
  }

  return (
    <div className="flex max-h-56 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-3">
      {permissionsQuery.data.map((permission) => (
        <Label
          key={permission.id}
          className="flex items-center gap-2 font-normal"
        >
          <Checkbox
            checked={selectedIds.includes(permission.id)}
            onCheckedChange={(checked) => toggle(permission.id, Boolean(checked))}
          />
          <span className="text-sm">{permission.key}</span>
        </Label>
      ))}
    </div>
  );
}