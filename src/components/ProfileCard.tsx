import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useStore } from "@/store/useStore";
import { Plus, Check } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
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

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return count.toString();
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { campaigns, activeCampaignId, addToCampaign, removeFromCampaign } = useStore();

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId);
  const isShortlisted = activeCampaign?.profiles.some((p) => p.user_id === profile.user_id) ?? false;

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleAddRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCampaignId) return;

    if (isShortlisted) {
      removeFromCampaign(profile.user_id, activeCampaignId);
    } else {
      addToCampaign(profile, activeCampaignId);
    }
  };

  const getPlatformColors = (p: Platform) => {
    if (p === "instagram") {
      return "from-pink-500 to-amber-500 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20";
    }
    if (p === "youtube") {
      return "from-red-600 to-rose-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
    }
    return "from-cyan-500 to-indigo-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20";
  };

  const platformColors = getPlatformColors(platform);

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/70 dark:bg-gray-800/75 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/40 rounded-2xl cursor-pointer hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg w-full max-w-full text-left"
      data-search={searchQuery}
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl bg-gradient-to-b ${platformColors.split(' ')[0]} ${platformColors.split(' ')[1]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative flex-shrink-0 self-start sm:self-center">
        <img
          src={profile.picture}
          className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm bg-gray-50"
          alt={profile.fullname}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`;
          }}
        />
        <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white bg-gradient-to-tr ${platformColors.split(' ')[0]} ${platformColors.split(' ')[1]} shadow-sm`}>
          <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            @{profile.username}
          </h3>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {profile.fullname}
        </p>

        <div className="flex gap-4 mt-2">
          <div>
            <span className="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">
              Followers
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {formatFollowersLocal(profile.followers)}
            </span>
          </div>
          {profile.engagement_rate !== undefined && (
            <div>
              <span className="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">
                Engagement
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {(profile.engagement_rate * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-stretch sm:items-end justify-between sm:justify-center gap-2 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700/50">
        <button
          type="button"
          onClick={handleAddRemove}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-sm ${
            isShortlisted
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
              : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:shadow"
          }`}
        >
          {isShortlisted ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Shortlisted</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to List</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
