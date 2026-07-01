import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="w-full">
      {profiles.length === 0 && (
        <div className="text-center py-16 bg-white/50 dark:bg-gray-800/10 rounded-2xl border border-gray-200/60 dark:border-gray-800/40">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No creators matched your search
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try searching another name or adjusting the query
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        <AnimatePresence mode="popLayout">
          {profiles.map((profile) => (
            <motion.div
              key={profile.user_id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex"
            >
              <ProfileCard
                profile={profile}
                platform={platform}
                searchQuery={searchQuery}
                onProfileClick={onProfileClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
