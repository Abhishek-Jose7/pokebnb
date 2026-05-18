import { create } from "zustand";
import type { LeaderboardRow } from "@/types";

interface LeaderboardState {
  rows: LeaderboardRow[];
  setRows: (rows: LeaderboardRow[]) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  rows: [],
  setRows: (rows) => set({ rows }),
}));
