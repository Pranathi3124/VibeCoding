import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, X } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PlatformIcon = ({ platform, className }: { platform: Platform; className?: string }) => {
  if (platform === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    );
  }
  // TikTok Custom SVG Icon
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2 3.69 2.37v3.9c-1.36-.08-2.68-.53-3.8-1.29-.63-.44-1.2-.97-1.66-1.58v6.23c.06 1.94-.48 3.88-1.56 5.43-1.4 1.99-3.7 3.22-6.17 3.33-2.61.12-5.18-.89-6.92-2.83C.08 18 .1 15.08 1.48 13.06c1.47-2.13 4-3.3 6.58-3.08v3.96c-1.39-.14-2.8.27-3.79 1.25-.91.9-1.34 2.22-1.12 3.49.25 1.41 1.34 2.57 2.74 2.91 1.41.34 2.95-.14 3.83-1.26.54-.7.8-1.58.75-2.47V0h2.05z" />
    </svg>
  );
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  // Get active pill visual accent
  const getSelectedAccent = (p: Platform) => {
    if (p === "instagram") {
      return "bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md shadow-pink-500/20 border-transparent";
    }
    if (p === "youtube") {
      return "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20 border-transparent";
    }
    return "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md shadow-teal-500/20 border-transparent";
  };

  return (
    <div className="space-y-4 w-full">
      {/* Platform Selectors */}
      <div className="flex gap-2 justify-start overflow-x-auto pb-1 scrollbar-none">
        {PLATFORMS.map((p) => {
          const isSelected = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl font-semibold text-sm border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? getSelectedAccent(p)
                  : "bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <PlatformIcon platform={p} className="w-4 h-4" />
              <span>{getPlatformLabel(p)}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="relative w-full max-w-2xl text-left">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${getPlatformLabel(selected)} creators by name or @username...`}
          className="w-full pl-11 pr-11 py-3.5 bg-white dark:bg-gray-800/40 backdrop-blur border border-gray-200 dark:border-gray-850 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
