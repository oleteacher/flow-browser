import { useTabs } from "@/components/providers/tabs-provider";
import { Button } from "@/components/ui/button";
import { SidebarGroup, useSidebar } from "@/components/ui/resizable-sidebar";
import { simplifyUrl } from "@/lib/url";
import { cn, copyTextToClipboard } from "@/lib/utils";
import { CheckIcon, LinkIcon, SearchIcon } from "lucide-react";
import { useRef, useState } from "react";

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

  const value = isPlaceholder ? "Search or type URL" : simplifiedUrl;

  const [copied, setCopied] = useState(false);
  const copyUrl = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (copied) return;

    event.stopPropagation();
    copyTextToClipboard(addressUrl, false).then((success) => {
      if (success) {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      }
    });
  };

  return (
    <div
      className={cn(
        // Standard shadcn <Input> styles
        "flex items-center gap-2",
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "rounded-xl border-0",
        // Custom styles
        "select-none selection:bg-transparent !ring-0",
        "transition-colors duration-150",
        "bg-white/20 dark:bg-white/15",
        "hover:bg-white/25 dark:hover:bg-white/20",
        isPlaceholder ? "text-black/60 dark:text-white/60" : "text-black dark:text-white"
      )}
      ref={inputRef}
      onClick={handleClick}
    >
      {isPlaceholder && <SearchIcon className="size-3.5" strokeWidth={2.5} />}
      <span className={cn("text-sm font-medium")}>{value}</span>
      {/* Right Side */}
      <div className="ml-auto flex items-center gap-1">
        {!isPlaceholder && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 hover:bg-black/10 dark:hover:bg-white/10"
            onClick={copyUrl}
          >
            {copied ? (
              <CheckIcon className="size-3.5" strokeWidth={2.5} />
            ) : (
              <LinkIcon className="size-3.5" strokeWidth={2.5} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export function SidebarAddressBar() {
  const { open } = useSidebar();
  if (!open) return null;

  return (
    <SidebarGroup className="pt-0 px-0">
      <FakeAddressBar />
    </SidebarGroup>
  );
}
