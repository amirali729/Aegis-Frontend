import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { useCommandPaletteStore } from "@/features/command-palette/store/command-palette-store";
import { useSearchResults } from "@/features/command-palette/hooks/use-search-results";
import type { SearchResultGroup } from "@/features/command-palette/lib/build-static-search-index";

const GROUP_ORDER: SearchResultGroup[] = [
  "Pages",
  "Organizations",
  "Applications",
  "Roles",
  "Permissions",
];

export function CommandPalette() {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const close = useCommandPaletteStore((state) => state.close);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { results, isLoading } = useSearchResults(isOpen);

  // Fresh search box each time the palette opens.
  useEffect(() => {
    if (isOpen) setSearch("");
  }, [isOpen]);

  function handleSelect(href: string) {
    close();
    navigate(href);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <DialogContent
        showCloseButton={false}
        className="top-[18%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search for pages, organizations, applications, roles, and permissions
        </DialogDescription>

        <Command shouldFilter loop>
          <div className="relative">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search anything..."
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {GROUP_ORDER.map((group) => {
              const items = results.filter((result) => result.group === group);
              if (items.length === 0) return null;

              return (
                <CommandGroup key={group} heading={group}>
                  {items.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.label} ${result.description ?? ""} ${(result.keywords ?? []).join(" ")}`}
                      onSelect={() => handleSelect(result.href)}
                    >
                      <result.icon />
                      <div className="min-w-0 flex-1">
                        <p className="truncate">{result.label}</p>
                        {result.description && (
                          <p className="truncate text-xs text-muted-foreground">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
