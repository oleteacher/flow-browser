import { useTabs } from "@/components/providers/tabs-provider";
import { Input } from "@/components/ui/input";
import { SidebarGroup, useSidebar } from "@/components/ui/resizable-sidebar";
import { simplifyUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useRef } from "react";

function FakeAddressBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addressUrl, focusedTab } = useTabs();

  const handleClick = () => {
    const inputBox = inputRef.current;
    if (!inputBox) return;

    const inputBoxBounds = inputBox.getBoundingClientRect();

    flow.omnibox.show(
      {
        x: inputBoxBounds.x,
        y: inputBoxBounds.y,
        width: inputBoxBounds.width * 2,
        height: inputBoxBounds.height * 8
      },
      {
        currentInput: addressUrl,
        openIn: focusedTab ? "current" : "new_tab"
      }
    );
  };

  const simplifiedUrl = simplifyUrl(addressUrl);
  const isPlaceholder = !simplifiedUrl;

  return (
    <Input
      ref={inputRef}
      value={isPlaceholder ? "Search or type URL" : simplifiedUrl}
      className={cn(
        "rounded-xl border-0",
        "select-none selection:bg-transparent !ring-0",
        "bg-white/20 dark:bg-white/15",
        isPlaceholder ? "text-black/60 dark:text-white/60" : "text-black dark:text-white"
      )}
      readOnly
      onClick={handleClick}
    />
  );
}

export function SidebarAddressBar() {
  const { open } = useSidebar();
  if (!open) return null;

  return (
    <SidebarGroup className="pt-0">
      <FakeAddressBar />
    </SidebarGroup>
  );
}
