import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { parseAddressBarInput } from "@/lib/url";
import { Search, Plus, X, Save, Trash2, Moon, Sun, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/main/theme";

// This interface will help with type safety for the quick links
interface QuickLink {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  extraClass?: string;
}

// Default logos for popular websites
const websiteLogos = {
  google: "https://www.google.com/favicon.ico",
  youtube: "https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png",
  github: "https://github.githubassets.com/favicons/favicon.svg",
  gmail: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
  twitter: "https://abs.twimg.com/responsive-web/client-web/icon-svg.168b89d5.svg",
  reddit: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png",
  netflix: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico",
  spotify: "https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico"
};

// Background colors for letter avatars
const bgColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500"
];

// Function to get a consistent color based on a string
const getColorForString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index];
};

// Letter Avatar component
interface LetterAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const LetterAvatar: React.FC<LetterAvatarProps> = ({ name, size = 32, className = "" }) => {
  const letter = name.charAt(0).toUpperCase();
  const bgColor = getColorForString(name);

  return (
    <div
      className={`flex items-center justify-center rounded-md text-white font-bold ${bgColor} ${className}`}
      style={{ width: size, height: size }}
    >
      {letter}
    </div>
  );
};

export default function NewTabPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  // Default quicklinks
  const defaultQuickLinks: QuickLink[] = [
    {
      id: "google",
      name: "Google",
      url: "https://www.google.com",
      logoUrl: websiteLogos.google
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://www.youtube.com",
      logoUrl: websiteLogos.youtube
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com",
      logoUrl: websiteLogos.github
    },
    {
      id: "gmail",
      name: "Gmail",
      url: "https://mail.google.com",
      logoUrl: websiteLogos.gmail
    },
    {
      id: "twitter",
      name: "Twitter",
      url: "https://twitter.com",
      logoUrl: websiteLogos.twitter
    },
    {
      id: "reddit",
      name: "Reddit",
      url: "https://reddit.com",
      logoUrl: websiteLogos.reddit
    },
    {
      id: "netflix",
      name: "Netflix",
      url: "https://netflix.com",
      logoUrl: websiteLogos.netflix
    },
    {
      id: "spotify",
      name: "Spotify",
      url: "https://spotify.com",
      logoUrl: websiteLogos.spotify
    }
  ];

  // Function to try to get a favicon for a domain
  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return `https://${domain}/favicon.ico`;
    } catch {
      return "";
    }
  };

  // Handle image load error
  const handleImageError = useCallback(() => {
    setLogoLoadError(true);
    setPreviewLogoUrl(null);
  }, []);

  // Function to fetch favicon when URL changes
  useEffect(() => {
    const fetchFavicon = async () => {
      if (!newLinkUrl || !newLinkUrl.trim()) {
        setPreviewLogoUrl(null);
        setLogoLoadError(false);
        return;
      }

      setIsFetchingLogo(true);
      setLogoLoadError(false);

      try {
        // Ensure URL has http:// or https:// prefix
        let url = newLinkUrl;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }

        // Get the domain
        const domain = new URL(url).hostname;

        // Try to get the favicon
        const faviconUrl = `https://${domain}/favicon.ico`;

        // Set the preview logo URL
        setPreviewLogoUrl(faviconUrl);
      } catch (error) {
        console.error("Error fetching favicon:", error);
        setPreviewLogoUrl(null);
        setLogoLoadError(true);
      } finally {
        setIsFetchingLogo(false);
      }
    };

    // Debounce the favicon fetch to avoid too many requests
    const timeoutId = setTimeout(fetchFavicon, 500);

    return () => clearTimeout(timeoutId);
  }, [newLinkUrl]);

  // Load quicklinks from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedLinks = localStorage.getItem("quickLinks");
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks);
        setQuickLinks(parsedLinks);
      } catch (error) {
        console.error("Failed to parse saved links:", error);
        setQuickLinks(defaultQuickLinks);
      }
    } else {
      setQuickLinks(defaultQuickLinks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save quicklinks to localStorage when they change
  useEffect(() => {
    if (mounted && quickLinks.length > 0) {
      localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
    }
  }, [quickLinks, mounted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use the parseAddressBarInput utility function to handle URL parsing
      const url = parseAddressBarInput(searchQuery);
      if (url) {
        window.location.href = url;
      }
    }
  };

  const toggleTheme = () => {
    // If current theme is system, set to explicit light/dark based on current resolved theme
    // Otherwise toggle between light and dark
    const newTheme =
      theme === "system" ? (resolvedTheme === "dark" ? "light" : "dark") : theme === "dark" ? "light" : "dark";
    console.log(`Switching theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
  };

  const handleAddLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      // Ensure URL has http:// or https:// prefix
      let url = newLinkUrl;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      const newLink: QuickLink = {
        id: Date.now().toString(),
        name: newLinkName,
        url: url,
        logoUrl: logoLoadError ? null : previewLogoUrl || getFaviconUrl(url)
      };

      setQuickLinks([...quickLinks, newLink]);
      setNewLinkName("");
      setNewLinkUrl("");
      setPreviewLogoUrl(null);
      setLogoLoadError(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    setQuickLinks(quickLinks.filter((link) => link.id !== id));
  };

  const handleResetToDefaults = () => {
    setQuickLinks(defaultQuickLinks);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      setNewLinkName("");
      setNewLinkUrl("");
      setPreviewLogoUrl(null);
      setLogoLoadError(false);
    }
  };

  if (!mounted) {
    // Return a placeholder or skeleton to avoid hydration mismatch
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white p-4 md:p-8 font-sans transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center relative w-full"
      >
        <button
          onClick={toggleTheme}
          type="button"
          className="absolute right-0 top-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </button>
        <div className="flex items-center justify-center gap-3">
          <div className="relative w-10 h-10">
            <img src="/assets/icon.png" alt="Flow Browser Logo" width={40} height={40} className="object-contain" />
          </div>
          <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-300">
            Flow Browser
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Your gateway to the web</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-xl mb-8 md:mb-12"
      >
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or enter website name"
            className="w-full py-3 px-6 pr-16 text-lg rounded-md bg-white border-none text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-400 transition-all duration-200"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-white rounded-md font-semibold cursor-pointer transition-transform duration-200 hover:shadow-md flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </motion.div>

      <div className="w-full max-w-3xl mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Quick Links</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">Add New Quick Link</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                    className="col-span-3 text-gray-900 dark:text-gray-100"
                    placeholder="Google"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right text-gray-700 dark:text-gray-300">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="col-span-3 text-gray-900 dark:text-gray-100"
                    placeholder="https://google.com"
                  />
                </div>

                {/* Logo Preview */}
                <div className="flex justify-center items-center mt-2">
                  {isFetchingLogo ? (
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : newLinkUrl ? (
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      {previewLogoUrl && !logoLoadError ? (
                        <img
                          src={previewLogoUrl || "/placeholder.svg"}
                          alt="Website logo preview"
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={handleImageError}
                        />
                      ) : (
                        newLinkName && <LetterAvatar name={newLinkName} size={32} />
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddLink} disabled={!newLinkName || !newLinkUrl}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleResetToDefaults} className="flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl"
      >
        <ScrollArea className="h-[240px] w-full rounded-md border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label={`Delete ${link.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
                <a
                  href={link.url}
                  className="flex flex-col items-center justify-center bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg p-3 no-underline shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full"
                >
                  <div className="mb-2 flex items-center justify-center w-10 h-10 overflow-hidden">
                    {link.logoUrl ? (
                      <div className="relative w-8 h-8">
                        <img
                          src={link.logoUrl || "/placeholder.svg"}
                          alt={`${link.name} logo`}
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            // If the image fails to load, replace with letter avatar
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            // We can't directly render a component here, so we'll hide the image
                          }}
                        />
                      </div>
                    ) : (
                      <LetterAvatar name={link.name} size={32} />
                    )}
                  </div>
                  <div className="font-medium text-base">{link.name}</div>
                </a>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>
          Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Tab</kbd> to focus on search
        </p>
      </motion.div>
    </div>
  );
}
