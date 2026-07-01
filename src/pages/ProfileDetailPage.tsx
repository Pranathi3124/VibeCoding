import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useStore } from "@/store/useStore";
import { FollowerHistoryChart } from "@/components/FollowerHistoryChart";
import {
  ArrowLeft,
  Plus,
  Check,
  Users,
  Percent,
  Layers,
  Heart,
  MessageSquare,
  Eye,
  HeartHandshake,
  User,
  Calendar,
  Globe,
  ExternalLink,
} from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const { campaigns, activeCampaignId, addToCampaign, removeFromCampaign } = useStore();

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Invalid Profile URL</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading profile report...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="max-w-md mx-auto text-center py-16 bg-white dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800/40 p-6">
          <p className="text-red-500 font-semibold mb-2">Profile Not Found</p>
          <p className="text-sm text-gray-500 mb-6">
            Detailed search reports are available for Cristiano, MrBeast, MrBeast6000, Khaby Lame, T-Series and Instagram.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-500/15"
          >
            Return to Directory
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const resolvedPlatform: Platform =
    (user.type as Platform) || (platformParam as Platform) || "instagram";

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];
  const isShortlisted = activeCampaign?.profiles.some((p) => p.user_id === user.user_id) ?? false;

  const handleAddRemove = () => {
    if (!activeCampaign) return;

    if (isShortlisted) {
      removeFromCampaign(user.user_id, activeCampaign.id);
    } else {
      addToCampaign(
        {
          user_id: user.user_id,
          username: user.username,
          url: user.url,
          picture: user.picture,
          fullname: user.fullname,
          is_verified: user.is_verified,
          followers: user.followers,
          engagement_rate: user.engagement_rate,
          engagements: user.engagements,
        },
        activeCampaign.id
      );
    }
  };

  const getPlatformLabelLocal = (p: Platform) => {
    if (p === "instagram") return "Instagram";
    if (p === "youtube") return "YouTube";
    return "TikTok";
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

  const platformColors = getPlatformColors(resolvedPlatform);

  return (
    <Layout>
      <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
        {/* Back Button */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 dark:border-gray-800 text-sm font-semibold rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to search</span>
          </Link>
        </div>

        {/* Profile Info Banner */}
        <div className="bg-white/80 dark:bg-gray-800/85 border border-gray-250/50 dark:border-gray-700/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Picture and Platform icon */}
          <div className="relative flex-shrink-0">
            <img
              src={user.picture}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md bg-gray-50"
              alt={user.fullname}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`;
              }}
            />
            <span
              className={`absolute -bottom-1 -right-1 p-1.5 rounded-full text-white bg-gradient-to-tr ${platformColors.split(" ")[0]} ${platformColors.split(" ")[1]} shadow`}
            >
              <span className="sr-only">{getPlatformLabelLocal(resolvedPlatform)}</span>
              {resolvedPlatform === "instagram" && <span className="text-xs font-bold font-sans">IG</span>}
              {resolvedPlatform === "youtube" && <span className="text-xs font-bold font-sans">YT</span>}
              {resolvedPlatform === "tiktok" && <span className="text-xs font-bold font-sans">TT</span>}
            </span>
          </div>

          {/* Bio info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-gray-950 dark:text-white">
                @{user.username}
              </h2>
              <VerifiedBadge verified={user.is_verified} />
            </div>

            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {user.fullname}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${platformColors.split(" ")[2]} ${platformColors.split(" ")[3]}`}
              >
                {getPlatformLabelLocal(resolvedPlatform)}
              </span>
              <span>•</span>
              <span className="font-mono text-2xs">ID: {user.user_id}</span>
            </div>

            {user.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                {user.description}
              </p>
            )}
          </div>

          {/* Action button */}
          <div className="flex-shrink-0 w-full md:w-auto self-stretch md:self-auto flex items-center">
            <button
              onClick={handleAddRemove}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-md cursor-pointer transition-all duration-300 ${
                isShortlisted
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-250/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20"
              }`}
            >
              {isShortlisted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Shortlisted</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add to List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Core Statistics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Followers
              </span>
              <span className="text-lg font-black text-gray-900 dark:text-white">
                {formatFollowersDetail(user.followers)}
              </span>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Engagement
              </span>
              <span className="text-lg font-black text-gray-900 dark:text-white">
                {user.engagement_rate !== undefined
                  ? formatEngagementRate(user.engagement_rate)
                  : "N/A"}
              </span>
            </div>
          </div>

          {user.engagements !== undefined && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Engagements
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {formatFollowersDetail(user.engagements)}
                </span>
              </div>
            </div>
          )}

          {user.posts_count !== undefined && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Posts
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {user.posts_count}
                </span>
              </div>
            </div>
          )}

          {user.avg_likes !== undefined && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Avg. Likes
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {formatFollowersDetail(user.avg_likes)}
                </span>
              </div>
            </div>
          )}

          {user.avg_comments !== undefined && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Avg. Comments
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {formatFollowersDetail(user.avg_comments)}
                </span>
              </div>
            </div>
          )}

          {user.avg_views !== undefined && user.avg_views > 0 && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Avg. Views
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {formatFollowersDetail(user.avg_views)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Audience Growth History Section */}
        {profileData.data.user_profile.stat_history && (
          <FollowerHistoryChart
            history={profileData.data.user_profile.stat_history}
          />
        )}

        {/* Additional metadata info cards */}
        {(user.gender || user.age_group || user.url) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-150 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Audience Demographics
              </h4>
              <div className="space-y-3">
                {user.gender && (
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <User className="w-4 h-4" /> Primary Gender
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                      {user.gender.toLowerCase()}
                    </span>
                  </div>
                )}
                {user.age_group && (
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> Core Age Group
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {user.age_group} years
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Global Rank
                  </span>
                  <span className="font-semibold text-gray-850 dark:text-gray-100">Top 1%</span>
                </div>
              </div>
            </div>

            {user.url && (
              <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-150 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Official Channel Reference
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                    View verified statistics and real-time content live on the creator's official social profile.
                  </p>
                </div>
                <a
                  href={user.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  <span>Open Creator Channel</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
