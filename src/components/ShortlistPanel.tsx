import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Trash2, X, FolderPlus, Sparkles, UserMinus, FileSpreadsheet, FileJson } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ShortlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortlistPanel({ isOpen, onClose }: ShortlistPanelProps) {
  const {
    campaigns,
    activeCampaignId,
    createCampaign,
    deleteCampaign,
    setActiveCampaignId,
    removeFromCampaign,
  } = useStore();

  const [newListName, setNewListName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];
  const listProfiles = activeCampaign?.profiles || [];

  // Aggregated Metrics
  const totalFollowers = listProfiles.reduce((sum, p) => sum + p.followers, 0);
  const avgEngagement = listProfiles.length
    ? listProfiles.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / listProfiles.length
    : 0;

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createCampaign(newListName.trim());
    setNewListName("");
    setShowCreateInput(false);
  };

  const handleDeleteActiveList = () => {
    if (campaigns.length <= 1) return;
    if (confirm(`Are you sure you want to delete "${activeCampaign.name}"?`)) {
      deleteCampaign(activeCampaign.id);
    }
  };

  const exportCSV = () => {
    if (!listProfiles.length) return;
    const headers = ["User ID", "Username", "Full Name", "Followers", "Engagement Rate", "URL"];
    const rows = listProfiles.map((p) => [
      p.user_id,
      p.username,
      p.fullname,
      p.followers,
      p.engagement_rate !== undefined ? `${(p.engagement_rate * 100).toFixed(2)}%` : "N/A",
      p.url,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeCampaign.name.replace(/\s+/g, "_")}_campaign.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (!listProfiles.length) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(listProfiles, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${activeCampaign.name.replace(/\s+/g, "_")}_campaign.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function formatCount(count: number) {
    if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return String(count);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 text-left">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Campaign Manager
          </h2>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Campaign Switcher */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Select Campaign List
            </label>
            <button
              onClick={() => setShowCreateInput(!showCreateInput)}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>New List</span>
            </button>
          </div>

          <AnimatePresence>
            {showCreateInput && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateList}
                className="mb-3 overflow-hidden flex gap-2"
              >
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="E.g. Summer Launch"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Create
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex gap-2 items-center">
            <select
              value={activeCampaignId}
              onChange={(e) => setActiveCampaignId(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.profiles.length})
                </option>
              ))}
            </select>
            {campaigns.length > 1 && (
              <button
                onClick={handleDeleteActiveList}
                title="Delete current list"
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Campaign Metrics Card */}
        {listProfiles.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100/50 dark:border-indigo-950/30 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3">
              Campaign Estimate
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-2xs text-gray-400 dark:text-gray-500 block uppercase font-medium">
                  Total Reach
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCount(totalFollowers)}
                </span>
              </div>
              <div>
                <span className="text-2xs text-gray-400 dark:text-gray-500 block uppercase font-medium">
                  Avg. Engagement
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {(avgEngagement * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Shortlisted Items List */}
        <div>
          <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-3">
            Influencers ({listProfiles.length})
          </label>

          {listProfiles.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No influencers shortlisted yet.
              </p>
              <p className="text-2xs text-gray-400 mt-1">
                Add them from the search list.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {listProfiles.map((p) => (
                  <motion.div
                    key={p.user_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 rounded-xl"
                  >
                    <img
                      src={p.picture}
                      className="w-9 h-9 rounded-full object-cover border border-white dark:border-gray-700 shadow-sm"
                      alt={p.fullname}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${p.username}`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                        @{p.username}
                      </div>
                      <div className="text-2xs text-gray-400 dark:text-gray-500 truncate">
                        {formatCount(p.followers)} Followers
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCampaign(p.user_id, activeCampaign.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Export Options */}
      {listProfiles.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2.5">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Export Campaign
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={exportJSON}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <FileJson className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar placement */}
      <div className="hidden lg:block lg:w-80 flex-shrink-0 h-[calc(100vh-100px)] sticky top-[80px]">
        <div className="h-full rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-gray-900">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Drawer Backdrop and Slider */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-full max-w-sm h-full lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
