import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useStore } from "@/store/useStore";
import { Users, Sparkles } from "lucide-react";

export function SearchPage() {
  const { platform, setPlatform, searchQuery, setSearchQuery } = useStore();
  const [clickCount, setClickCount] = useState(0);

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const handleProfileClick = (username: string) => {
    setClickCount((prev) => {
      const next = prev + 1;
      console.log("Clicked profile:", username, "total clicks:", next);
      return next;
    });
  };

  return (
    <Layout title="Creator Search">
      <div className="flex flex-col gap-6 text-left">
        {/* Modern Welcome Dashboard Banner */}
        <div className="bg-gradient-to-tr from-indigo-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-indigo-900/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 bg-indigo-800/40 border border-indigo-700/50 px-3 py-1 rounded-full w-max text-xs font-semibold mb-4 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Influencer Directory v2.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
              Discover top social creators
            </h2>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              Search by username or name, filter by platforms, and select candidates. Build custom target lists and export your campaign data seamlessly.
            </p>
          </div>
        </div>

        {/* Search controls */}
        <div className="space-y-3.5">
          <PlatformFilter
            selected={platform}
            onChange={(p) => {
              setPlatform(p);
              setSearchQuery("");
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-1 pr-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <span>
                Showing {filtered.length} of {allProfiles.length} creators
              </span>
            </div>
            {clickCount > 0 && (
              <span className="text-2xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md normal-case">
                Session Clicks: {clickCount}
              </span>
            )}
          </div>
        </div>

        {/* Creator list */}
        <ProfileList
          profiles={filtered}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={handleProfileClick}
        />
      </div>
    </Layout>
  );
}
