import { motion } from "framer-motion";
import { Gamepad2, Wrench, Users, Trophy, Bot, BookOpen, Crown, User, Sparkles, LogOut } from "lucide-react";
import { getUserStats, syncWithServer, logoutUser, getUserName } from "@/lib/userStore";
import { useEffect, useState } from "react";

interface LobbyScreenProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const menuItems = [
  { id: "race", label: "START RACE", icon: Gamepad2, description: "Choose language & race", color: "hsl(42 100% 55%)", bgAlpha: 0.08 },
  { id: "garage", label: "GARAGE", icon: Wrench, description: "Customize your ride", color: "hsl(15 70% 55%)", bgAlpha: 0.08 },
  { id: "character", label: "CHARACTER", icon: User, description: "AI Co-Pilot & stats", color: "hsl(210 25% 65%)", bgAlpha: 0.06 },
  { id: "friends", label: "FRIENDS", icon: Users, description: "Multiplayer arena", color: "hsl(155 60% 45%)", bgAlpha: 0.08 },
  { id: "leaderboard", label: "RANKINGS", icon: Trophy, description: "Global leaderboard", color: "hsl(42 80% 65%)", bgAlpha: 0.06 },
  { id: "library", label: "LIBRARY", icon: BookOpen, description: "Tutorials & resources", color: "hsl(220 70% 55%)", bgAlpha: 0.06 },
];

const LobbyScreen = ({ onNavigate, onLogout }: LobbyScreenProps) => {
  const stats = getUserStats();

  const handleLogout = () => {
    logoutUser();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, hsl(42 80% 8% / 0.3), transparent 45%), radial-gradient(ellipse at 0% 100%, hsl(15 50% 8% / 0.2), transparent 40%), hsl(240 20% 3%)",
      }}
    >
      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full"
          style={{
            left: `${(i * 10) % 100}%`,
            top: `${(i * 12) % 100}%`,
            background: "hsl(42 100% 55% / 0.3)",
          }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <div className="absolute top-6 right-6">
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 border border-white/10 text-xs font-mono text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-all">
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4">
        {/* Player Info Bar */}
        <motion.div
          className="mb-5 flex items-center gap-4 rounded-xl px-5 py-2.5"
          style={{
            background: "hsl(240 15% 7% / 0.8)",
            border: "1px solid hsl(42 100% 55% / 0.1)",
            backdropFilter: "blur(15px)",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 pr-2 border-r border-border/50">
            <span className="font-display font-bold text-white tracking-widest">{getUserName()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Crown size={14} className="text-primary" />
            <span className="font-display text-sm font-bold text-primary">LV. {stats.level}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Trophy size={13} className="text-luxury-champagne" />
            <span className="font-mono text-xs text-luxury-champagne">{stats.coins.toLocaleString()}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-luxury-platinum" />
            <span className="font-mono text-xs text-muted-foreground">{stats.rewardPoints.toLocaleString()} PTS</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div className="mb-10 text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h1 className="font-display text-4xl font-bold tracking-[0.15em] md:text-5xl">
            <span style={{
              background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px hsl(42 100% 55% / 0.3))",
            }}>
              LEVEL UP
            </span>
            {" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(210 25% 75%), hsl(210 25% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              CODE
            </span>
          </h1>
          <div className="mx-auto mt-3 h-px w-24" style={{ background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.3), transparent)" }} />
        </motion.div>

        {/* Menu Grid */}
        <div className="mb-10 grid w-full grid-cols-2 gap-3 md:grid-cols-3">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl p-6 transition-all"
              style={{
                background: `linear-gradient(135deg, ${item.color.replace(')', ` / ${item.bgAlpha})`)}, transparent)`,
                border: `1px solid ${item.color.replace(')', ' / 0.15)')}`,
                backdropFilter: "blur(10px)",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{
                scale: 1.04,
                y: -4,
                boxShadow: `0 0 40px ${item.color.replace(')', ' / 0.12)')}`,
              }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Shimmer on hover */}
              <div
                className="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.03), transparent)" }}
              />

              <item.icon className="relative z-10 h-7 w-7 transition-all group-hover:drop-shadow-[0_0_8px_currentColor]" style={{ color: item.color }} />
              <span className="relative z-10 font-display text-[11px] font-bold tracking-[0.15em] text-foreground">
                {item.label}
              </span>
              <span className="relative z-10 font-body text-[11px] text-muted-foreground">{item.description}</span>
            </motion.button>
          ))}
        </div>

        {/* XP Progress */}
        <motion.div
          className="w-full max-w-lg rounded-xl px-6 py-4"
          style={{
            background: "hsl(240 15% 7% / 0.8)",
            border: "1px solid hsl(42 100% 55% / 0.08)",
            backdropFilter: "blur(15px)",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-2 flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>PROGRESS TO LV. {stats.level + 1}</span>
                <span className="text-primary">{stats.exp} / {stats.level * 500} XP</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "hsl(240 15% 12%)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(42 100% 55%), hsl(42 80% 65%), hsl(15 70% 55%))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.exp / (stats.level * 500)) * 100}%` }}
                  transition={{ delay: 0.9, duration: 1.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mt-5 font-body text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🏎️ Season "Golden Era" is live — race to earn exclusive rewards
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LobbyScreen;
