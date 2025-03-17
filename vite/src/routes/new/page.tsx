import { useState } from "react";
import { motion } from "motion/react";
import { parseAddressBarInput } from "@/lib/url";
import Google from "@/components/svgl/google";
import YouTube from "@/components/svgl/youtube";
import GitHub from "@/components/svgl/github";
import Gmail from "@/components/svgl/gmail";
import Twitter from "@/components/svgl/twitter";
import Reddit from "@/components/svgl/reddit";
import Netflix from "@/components/svgl/netflix";
import Spotify from "@/components/svgl/spotify";

// This interface will help with type safety for the quick links
interface QuickLink {
  name: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  extraClass?: string;
}

function NewTabPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder for SVG components - replace these with your actual SVG components
  const quickLinks: QuickLink[] = [
    {
      name: "Google",
      url: "https://www.google.com",
      icon: Google
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com",
      icon: YouTube
    },
    {
      name: "GitHub",
      url: "https://github.com",
      icon: GitHub,
      extraClass: "bg-gray-700 dark:bg-gray-800 p-1 rounded-full"
    },
    {
      name: "Gmail",
      url: "https://mail.google.com",
      icon: Gmail
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: Twitter
    },
    {
      name: "Reddit",
      url: "https://reddit.com",
      icon: Reddit
    },
    {
      name: "Netflix",
      url: "https://netflix.com",
      icon: Netflix
    },
    {
      name: "Spotify",
      url: "https://spotify.com",
      icon: Spotify
    }
  ];

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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 dark:text-white p-8 font-sans transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-300">
          Flow Browser
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-xl mb-12"
      >
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or enter website name"
            className="w-full py-3 px-6 text-lg rounded-full bg-white border-none text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-400 transition-all duration-200"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-white rounded-full font-semibold cursor-pointer transition-transform duration-200 hover:shadow-md"
          >
            Search
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-4 gap-3 w-full max-w-3xl md:grid-cols-4 sm:grid-cols-2"
      >
        {quickLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            className="flex flex-col items-center justify-center bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 no-underline shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <div className={`mb-1 text-gray-700 dark:text-gray-300 ${link.extraClass || ""}`}>
              <link.icon className="w-8 h-8" />
            </div>
            <div className="font-medium text-base">{link.name}</div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

export default NewTabPage;
