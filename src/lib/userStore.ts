// Simple persistent user store for Level Up system
export interface UserStats {
  level: number;
  exp: number;
  wins: number;
  totalCorrect: number;
  perfectRaces: number;
  coins: number;
  rewardPoints: number;
}

const DEFAULT_STATS: UserStats = {
  level: 1,
  exp: 0,
  wins: 0,
  totalCorrect: 0,
  perfectRaces: 0,
  coins: 0,
  rewardPoints: 0,
};

import { SERVER_URL } from "@/lib/api";

export const getUserStats = (): UserStats => {
  const saved = localStorage.getItem("code_racer_user_stats");
  if (!saved) return DEFAULT_STATS;
  try {
    const stats = JSON.parse(saved);
    // Migration: ensure new fields exist
    return { ...DEFAULT_STATS, ...stats };
  } catch {
    return DEFAULT_STATS;
  }
};

export const getUserId = () => localStorage.getItem("code_racer_user_id") || "";
export const getUserName = () => localStorage.getItem("code_racer_user_name") || "Player_1";

export const setUserId = (id: string, username: string) => {
  localStorage.setItem("code_racer_user_id", id);
  localStorage.setItem("code_racer_user_name", username);
};

export const logoutUser = () => {
  localStorage.removeItem("code_racer_user_id");
  localStorage.removeItem("code_racer_user_name");
};

export const syncWithServer = async (): Promise<UserStats> => {
  const userId = getUserId();
  if (!userId) return getUserStats(); // Requires auth

  try {
    const response = await fetch(`${SERVER_URL}/api/stats?userId=${userId}`);
    if (response.ok) {
      const serverStats = await response.json();
      const localStats = getUserStats();
      const merged: UserStats = {
        ...localStats,
        level: Math.max(localStats.level, serverStats.level),
        exp: Math.max(localStats.exp, serverStats.exp || 0),
        coins: Math.max(localStats.coins, serverStats.coins),
        rewardPoints: Math.max(localStats.rewardPoints, serverStats.rewardPoints),
      };
      saveUserStats(merged);
      return merged;
    }
  } catch (e) {
    console.warn("Backend unavailable, using local cache.");
  }
  return getUserStats();
};

export const saveUserStats = (stats: UserStats) => {
  localStorage.setItem("code_racer_user_stats", JSON.stringify(stats));
};

export const addRewards = async (coins: number, points: number, exp: number = 0) => {
  const stats = getUserStats();
  stats.coins += coins;
  stats.rewardPoints += points;
  stats.exp += exp;

  saveUserStats(stats);
  
  const userId = getUserId();
  if (userId) {
    try {
      fetch(`${SERVER_URL}/api/reward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, coins, points, exp })
      }).catch(() => {});
    } catch (e) {}
  }

  return stats;
};

export const addExp = (amount: number) => {
  const stats = getUserStats();
  stats.exp += amount;
  
  // Level up logic (e.g., each level needs level * 500 exp)
  const nextLevelExp = stats.level * 500;
  if (stats.exp >= nextLevelExp) {
    stats.level += 1;
    stats.exp -= nextLevelExp;
  }
  
  saveUserStats(stats);
  return stats;
};

export const recordWin = (isPerfect: boolean = false) => {
  const stats = getUserStats();
  stats.wins += 1;
  if (isPerfect) stats.perfectRaces += 1;
  saveUserStats(stats);
};

export const incrementCorrectAnswers = (count: number) => {
  const stats = getUserStats();
  stats.totalCorrect += count;
  saveUserStats(stats);
};
