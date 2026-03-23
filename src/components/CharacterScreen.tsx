import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Trophy, Shield, Settings, Mail, Bell, Languages, Code2, Sparkles, Terminal, Cpu, Send, Bot, BookOpen, Gamepad2, Wrench, Target, Flame, Crosshair } from "lucide-react";
import { getUserStats, syncWithServer } from "@/lib/userStore";
import { SERVER_URL } from "@/lib/api";

interface CharacterScreenProps {
  onBack: () => void;
}

interface Message { id: number; role: "user" | "assistant"; text: string; }

const quickPrompts = [
  { icon: Gamepad2, label: "Racing tips", prompt: "Give me tips for winning races." },
  { icon: Wrench, label: "Customize", prompt: "How do I customize my car?" },
  { icon: BookOpen, label: "Learn Python", prompt: "Tips for learning Python." },
  { icon: Sparkles, label: "Rewards", prompt: "How do I earn rewards?" },
];

const DEFAULT_GREETING = "👋 I'm your AI Co-Pilot!\n• 🏎️ Racing strategies\n• 🔧 Customization tips\n• 📚 Coding tutorials\n• 🏆 Progression help\n\nAsk me anything!";

const CharacterScreen = ({ onBack }: CharacterScreenProps) => {
  const [stats, setStats] = useState(() => getUserStats());

  useEffect(() => {
    syncWithServer().then((s) => setStats(s));
  }, []);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: DEFAULT_GREETING }]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"chat" | "profile">("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch(`${SERVER_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: data.response }]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: "⚠️ ORBITAI Neural Link Offline." }]);
    }
  };

  const pilotStats = [
    { icon: Trophy, label: "WINS", value: stats.wins.toString(), color: "text-primary" },
    { icon: Target, label: "CHALLENGES", value: stats.totalCorrect.toString(), color: "text-luxury-platinum" },
    { icon: Crosshair, label: "ACCURACY", value: stats.totalCorrect > 0 ? `${Math.round((stats.totalCorrect / (stats.wins * 10 || 1)) * 100)}%` : "0%", color: "text-luxury-emerald" },
    { icon: Flame, label: "PERFECTS", value: stats.perfectRaces.toString(), color: "text-luxury-rose-gold" },
  ];

  const panelStyle = { background: "hsl(240 15% 7% / 0.6)", border: "1px solid hsl(42 100% 55% / 0.06)" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen flex-col overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 20%, hsl(210 20% 6% / 0.3), transparent 45%), hsl(240 20% 3%)" }}>
      <div className="relative z-10 flex flex-1 flex-col p-4 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={20} /></button>
          <motion.div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(210 25% 65%), hsl(42 100% 55%))", boxShadow: "0 0 15px hsl(42 100% 55% / 0.15)" }} animate={{ boxShadow: ["0 0 15px hsl(42 100% 55% / 0.15)", "0 0 25px hsl(42 100% 55% / 0.3)", "0 0 15px hsl(42 100% 55% / 0.15)"] }} transition={{ duration: 3, repeat: Infinity }}>
            <Bot size={15} className="text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-xl font-bold tracking-[0.15em]" style={{ background: "linear-gradient(135deg, hsl(210 25% 75%), hsl(42 100% 55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Co-Pilot</h1>
          <span className="ml-2 rounded-full px-2 py-0.5 font-mono text-[10px]" style={{ background: "hsl(155 60% 45% / 0.1)", color: "hsl(155 60% 45%)", border: "1px solid hsl(155 60% 45% / 0.2)" }}>ONLINE</span>
        </div>

        <div className="mb-4 flex gap-2">
          {(["chat", "profile"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="flex items-center gap-2 rounded-xl px-4 py-2 font-display text-[10px] font-bold tracking-[0.1em] transition-all" style={{ background: tab === t ? "hsl(42 100% 55% / 0.08)" : "hsl(240 15% 7% / 0.5)", border: `1px solid ${tab === t ? "hsl(42 100% 55% / 0.2)" : "hsl(42 100% 55% / 0.04)"}`, color: tab === t ? "hsl(42 100% 55%)" : "hsl(40 10% 50%)" }}>
              {t === "chat" ? <Send size={11} /> : <User size={11} />}{t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "chat" && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {quickPrompts.map((qp) => (
                <button key={qp.label} onClick={() => sendMessage(qp.prompt)} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-body text-[11px] text-muted-foreground transition-all hover:text-primary" style={panelStyle}><qp.icon size={12} />{qp.label}</button>
              ))}
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl p-4" style={{ maxHeight: "calc(100vh - 320px)", background: "hsl(240 15% 5% / 0.6)", border: "1px solid hsl(42 100% 55% / 0.06)" }}>
              {messages.map((msg) => (
                <motion.div key={msg.id} className={`mb-3 flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  {msg.role === "assistant" && <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "hsl(42 100% 55% / 0.1)" }}><Bot size={13} className="text-primary" /></div>}
                  <div className="max-w-[75%] whitespace-pre-line rounded-xl px-3 py-2 font-body text-sm" style={{ background: msg.role === "user" ? "hsl(42 100% 55% / 0.08)" : "hsl(240 15% 8%)", border: `1px solid ${msg.role === "user" ? "hsl(42 100% 55% / 0.1)" : "hsl(42 100% 55% / 0.04)"}`, color: "hsl(40 15% 85%)" }}>{msg.text}</div>
                  {msg.role === "user" && <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "hsl(15 70% 55% / 0.1)" }}><User size={13} className="text-luxury-rose-gold" /></div>}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)} placeholder="Ask your Co-Pilot..." className="flex-1 rounded-xl px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none" style={{ background: "hsl(240 15% 7% / 0.6)", border: "1px solid hsl(42 100% 55% / 0.08)" }} />
              <button onClick={() => sendMessage(input)} className="rounded-xl px-4 py-2.5 transition-all" style={{ background: "linear-gradient(135deg, hsl(42 100% 55%), hsl(42 80% 45%))", color: "hsl(240 20% 3%)" }}><Send size={15} /></button>
            </div>
          </>
        )}

        {tab === "profile" && (
          <motion.div className="mx-auto w-full max-w-lg" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 rounded-xl p-6" style={{ background: "hsl(42 100% 55% / 0.03)", border: "1px solid hsl(42 100% 55% / 0.1)" }}>
              <div className="mb-4 flex items-center gap-4">
                <motion.div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(210 25% 65%), hsl(42 100% 55%))", boxShadow: "0 0 25px hsl(42 100% 55% / 0.15)" }} animate={{ boxShadow: ["0 0 20px hsl(42 100% 55% / 0.15)", "0 0 35px hsl(42 100% 55% / 0.25)", "0 0 20px hsl(42 100% 55% / 0.15)"] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Bot size={26} className="text-primary-foreground" />
                </motion.div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">PILOT_CORE</h2>
                  <p className="font-body text-xs text-muted-foreground">AI CO-PILOT v2.4</p>
                  <p className="font-body text-xs text-primary">LEVEL {stats.level} · {stats.exp} XP</p>
                </div>
              </div>

              {/* Rewards Wallet */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "hsl(42 100% 55% / 0.05)", border: "1px solid hsl(42 100% 55% / 0.15)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={14} className="text-primary" />
                    <span className="font-mono text-[9px] text-primary uppercase tracking-widest">Balance</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-primary">{stats.coins.toLocaleString()}</p>
                  <p className="font-mono text-[8px] text-muted-foreground">COINS COLLECTED</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "hsl(210 25% 65% / 0.05)", border: "1px solid hsl(210 25% 65% / 0.15)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-luxury-platinum" />
                    <span className="font-mono text-[9px] text-luxury-platinum uppercase tracking-widest">Reputation</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-luxury-platinum">{stats.rewardPoints.toLocaleString()}</p>
                  <p className="font-mono text-[8px] text-muted-foreground">REWARD POINTS</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {pilotStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 rounded-xl p-3" style={panelStyle}>
                    <stat.icon size={16} className={stat.color} />
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground">{stat.label}</p>
                      <p className={`font-display text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4" style={panelStyle}>
              <h3 className="mb-3 font-display text-[11px] font-bold tracking-[0.15em] text-primary">ACHIEVEMENTS</h3>
              {[
                { name: "Speed Demon", desc: "Complete 10 races under 2 min", earned: stats.wins >= 10 },
                { name: "Code Master", desc: "100 correct answers total", earned: stats.totalCorrect >= 100 },
                { name: "Perfect Sync", desc: "Achieve 5 perfect races", earned: stats.perfectRaces >= 5 },
              ].map((ach) => (
                <div key={ach.name} className="mb-2 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: ach.earned ? "hsl(42 100% 55% / 0.03)" : "hsl(240 15% 7% / 0.3)", border: `1px solid ${ach.earned ? "hsl(42 100% 55% / 0.1)" : "hsl(42 100% 55% / 0.03)"}`, opacity: ach.earned ? 1 : 0.4 }}>
                  <div>
                    <p className="font-display text-xs font-bold text-foreground">{ach.name}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{ach.desc}</p>
                  </div>
                  {ach.earned && <Trophy size={13} className="text-primary" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CharacterScreen;

