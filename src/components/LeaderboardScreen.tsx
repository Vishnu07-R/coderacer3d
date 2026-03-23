import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Medal, Flame, Crown, ChevronUp, ChevronDown } from "lucide-react";
import { SERVER_URL } from "@/lib/api";

interface LeaderboardScreenProps {
  onBack: () => void;
}

type TimeFilter = "daily" | "weekly" | "monthly" | "alltime";

const mockPlayers = [
  { rank: 1, name: "ByteSlayer", score: 98500, races: 312, streak: 14, change: 0 },
  { rank: 2, name: "NeonCoder", score: 87200, races: 289, streak: 9, change: 1 },
  { rank: 3, name: "PixelRacer", score: 81400, races: 276, streak: 7, change: -1 },
  { rank: 4, name: "SyntaxDrift", score: 74100, races: 245, streak: 5, change: 2 },
  { rank: 5, name: "CodeVortex", score: 69800, races: 230, streak: 4, change: 0 },
  { rank: 6, name: "TurboStack", score: 62300, races: 198, streak: 3, change: -2 },
  { rank: 7, name: "LoopKing", score: 58900, races: 187, streak: 6, change: 1 },
  { rank: 8, name: "ArrayAce", score: 54200, races: 172, streak: 2, change: 0 },
  { rank: 9, name: "HashRunner", score: 49700, races: 156, streak: 1, change: -1 },
  { rank: 10, name: "RecursoMax", score: 45100, races: 143, streak: 0, change: 3 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown size={16} className="text-primary" />;
  if (rank === 2) return <Medal size={16} className="text-luxury-platinum" />;
  if (rank === 3) return <Medal size={16} className="text-luxury-rose-gold" />;
  return <span className="font-mono text-xs text-muted-foreground">#{rank}</span>;
};

const LeaderboardScreen = ({ onBack }: LeaderboardScreenProps) => {
  const [filter, setFilter] = useState<TimeFilter>("weekly");
  const [players, setPlayers] = useState<any[]>(mockPlayers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        // Map server data to leaderboard format
        const live = data.map((p: any, i: number) => ({
          rank: i + 1,
          name: p.name,
          score: p.score,
          races: p.level * 5, // Simulated races
          streak: Math.min(10, p.level),
          change: 0
        }));
        setPlayers(live.length > 0 ? live : mockPlayers);
      })
      .catch(() => setPlayers(mockPlayers))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(42 80% 6% / 0.3), transparent 40%), hsl(240 20% 3%)" }}
    >
      <div className="relative z-10 flex flex-1 flex-col p-4 md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={20} /></button>
          <Trophy size={18} className="text-primary" />
          <h1 className="font-display text-xl font-bold tracking-[0.15em]" style={{ background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rankings</h1>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {(["daily", "weekly", "monthly", "alltime"] as TimeFilter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="rounded-xl px-4 py-2 font-display text-[10px] font-bold tracking-[0.1em] transition-all" style={{ background: filter === f ? "hsl(42 100% 55% / 0.08)" : "hsl(240 15% 7% / 0.5)", border: `1px solid ${filter === f ? "hsl(42 100% 55% / 0.2)" : "hsl(42 100% 55% / 0.04)"}`, color: filter === f ? "hsl(42 100% 55%)" : "hsl(40 10% 50%)" }}>
              {f === "alltime" ? "ALL TIME" : f.toUpperCase()}
            </button>
          ))}
        </div>

        <motion.div className="mx-auto mb-6 flex w-full max-w-2xl items-center gap-4 rounded-xl px-4 py-3" style={{ background: "hsl(42 100% 55% / 0.05)", border: "1px solid hsl(42 100% 55% / 0.12)" }} initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span className="font-display text-lg font-bold text-primary">#42</span>
          <span className="flex-1 font-display text-sm font-bold text-foreground">YOU</span>
          <span className="font-mono text-xs text-muted-foreground">12,400 PTS</span>
          <span className="flex items-center gap-1 font-mono text-xs text-luxury-emerald"><ChevronUp size={12} /> 3</span>
        </motion.div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-2 grid grid-cols-[40px_1fr_80px_80px_60px_50px] gap-2 px-3 font-mono text-[10px] text-muted-foreground">
            <span>RANK</span><span>PLAYER</span><span className="text-right">SCORE</span><span className="text-right">RACES</span><span className="text-right">STREAK</span><span className="text-right">Δ</span>
          </div>
          {players.map((player, i) => (
            <motion.div key={player.name} className="mb-1.5 grid grid-cols-[40px_1fr_80px_80px_60px_50px] items-center gap-2 rounded-xl px-3 py-2.5 transition-all" style={{ background: player.rank <= 3 ? "hsl(42 100% 55% / 0.03)" : "hsl(240 15% 7% / 0.4)", border: `1px solid ${player.rank <= 3 ? "hsl(42 100% 55% / 0.1)" : "hsl(42 100% 55% / 0.03)"}` }} initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
              <div>{getRankIcon(player.rank)}</div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px]" style={{ background: "hsl(42 100% 55% / 0.1)", color: "hsl(42 100% 55%)" }}>{player.name[0]}</div>
                <span className="font-display text-xs font-bold text-foreground">{player.name}</span>
              </div>
              <span className="text-right font-mono text-xs text-foreground">{player.score.toLocaleString()}</span>
              <span className="text-right font-mono text-xs text-muted-foreground">{player.races}</span>
              <span className="text-right font-mono text-xs text-luxury-rose-gold">{player.streak > 0 && <Flame size={10} className="mr-0.5 inline" />}{player.streak}</span>
              <span className={`flex items-center justify-end font-mono text-xs ${player.change > 0 ? "text-luxury-emerald" : player.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {player.change > 0 && <ChevronUp size={10} />}{player.change < 0 && <ChevronDown size={10} />}{player.change !== 0 ? Math.abs(player.change) : "—"}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div className="mx-auto mt-6 flex w-full max-w-2xl items-center justify-between rounded-xl px-4 py-3" style={{ background: "hsl(42 100% 55% / 0.03)", border: "1px solid hsl(42 100% 55% / 0.08)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="font-body text-xs text-muted-foreground">🏆 Top 10 earn exclusive car skins this season</span>
          <span className="font-display text-xs font-bold text-primary">5d 12h LEFT</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaderboardScreen;
