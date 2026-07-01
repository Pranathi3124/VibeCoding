import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { ShortlistPanel } from "./ShortlistPanel";
import { Moon, Sun, Sparkles, FolderHeart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { campaigns, activeCampaignId } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];
  const shortlistCount = activeCampaign?.profiles.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0d12] text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 fill-current" />
            </span>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-indigo-900 dark:from-white dark:via-indigo-100 dark:to-indigo-200 bg-clip-text text-transparent">
              VibeCoder <span className="text-indigo-600 dark:text-indigo-400 font-medium text-xs border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-md ml-1">Dashboard</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Shortlist drawer toggle (mobile only) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative lg:hidden p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              title="Open Campaign Manager"
            >
              <FolderHeart className="w-5 h-5" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-pulse">
                  {shortlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Shell Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            {title && (
              <div className="text-left mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {title}
                </h1>
              </div>
            )}
            <div>{children}</div>
          </div>

          {/* Shortlist Sidebar (Desktop) / Slide Drawer (Mobile) */}
          <ShortlistPanel isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </div>
      </main>
    </div>
  );
}
