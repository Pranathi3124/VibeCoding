import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface Campaign {
  id: string;
  name: string;
  profiles: UserProfileSummary[];
}

interface AppState {
  platform: Platform;
  searchQuery: string;
  campaigns: Campaign[];
  activeCampaignId: string;
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  addToCampaign: (profile: UserProfileSummary, campaignId: string) => void;
  removeFromCampaign: (userId: string, campaignId: string) => void;
  createCampaign: (name: string) => void;
  deleteCampaign: (campaignId: string) => void;
  setActiveCampaignId: (campaignId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      platform: "instagram",
      searchQuery: "",
      campaigns: [
        {
          id: "default",
          name: "My Shortlist",
          profiles: [],
        },
      ],
      activeCampaignId: "default",
      setPlatform: (platform) => set({ platform }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      addToCampaign: (profile, campaignId) =>
        set((state) => {
          const campaigns = state.campaigns.map((c) => {
            if (c.id === campaignId) {
              if (c.profiles.some((p) => p.user_id === profile.user_id)) {
                return c;
              }
              return { ...c, profiles: [...c.profiles, profile] };
            }
            return c;
          });
          return { campaigns };
        }),
      removeFromCampaign: (userId, campaignId) =>
        set((state) => {
          const campaigns = state.campaigns.map((c) => {
            if (c.id === campaignId) {
              return {
                ...c,
                profiles: c.profiles.filter((p) => p.user_id !== userId),
              };
            }
            return c;
          });
          return { campaigns };
        }),
      createCampaign: (name) =>
        set((state) => {
          const newId = `campaign-${Date.now()}`;
          const newCampaign: Campaign = {
            id: newId,
            name,
            profiles: [],
          };
          return {
            campaigns: [...state.campaigns, newCampaign],
            activeCampaignId: newId,
          };
        }),
      deleteCampaign: (campaignId) =>
        set((state) => {
          if (state.campaigns.length <= 1) return {};
          const filtered = state.campaigns.filter((c) => c.id !== campaignId);
          const nextActiveId =
            state.activeCampaignId === campaignId ? filtered[0].id : state.activeCampaignId;
          return {
            campaigns: filtered,
            activeCampaignId: nextActiveId,
          };
        }),
      setActiveCampaignId: (activeCampaignId) => set({ activeCampaignId }),
    }),
    {
      name: "wobb-influencer-search-storage",
      partialize: (state) => ({
        platform: state.platform,
        searchQuery: state.searchQuery,
        campaigns: state.campaigns,
        activeCampaignId: state.activeCampaignId,
      }),
    }
  )
);
