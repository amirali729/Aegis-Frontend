import type { ComponentProps } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "@/shared/lib/utils";

const DropdownMenu = MenuPrimitive.Root;
const DropdownMenuTrigger = MenuPrimitive.Trigger;

function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "end",
  ...props
}: ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<ComponentProps<typeof MenuPrimitive.Positioner>, "sideOffset" | "align">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner sideOffset={sideOffset} align={align}>
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-[10rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & {
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none",
        "data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};