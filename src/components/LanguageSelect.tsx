import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";

interface LanguageSelectProps {
  onSelect: (lang: string) => void;
  onBack: () => void;
}

const languages = [
  { name: "Python", icon: "🐍", color: "hsl(155 60% 45%)" },
  { name: "C", icon: "⚙️", color: "hsl(210 60% 50%)" },
  { name: "C++", icon: "➕", color: "hsl(220 70% 55%)" },
  { name: "SQL", icon: "🗄️", color: "hsl(210 25% 65%)" },
  { name: "Java", icon: "☕", color: "hsl(15 70% 55%)" },
  { name: "JavaScript", icon: "⚡", color: "hsl(42 100% 55%)" },
  { name: "NumPy", icon: "🔢", color: "hsl(210 60% 50%)" },
  { name: "PHP", icon: "🐘", color: "hsl(260 50% 55%)" },
  { name: "Pandas", icon: "🐼", color: "hsl(220 70% 55%)" },
  { name: "TypeScript", icon: "📘", color: "hsl(210 80% 55%)" },
  { name: "Full Stack", icon: "🚀", color: "hsl(42 80% 65%)" },
  { name: "React", icon: "⚛️", color: "hsl(195 80% 55%)" },
  { name: "Rust", icon: "🦀", color: "hsl(15 60% 50%)" },
  { name: "Go", icon: "🔵", color: "hsl(195 60% 50%)" },
  { name: "Ruby", icon: "💎", color: "hsl(350 65% 50%)" },
];

const LanguageSelect = ({ onSelect, onBack }: LanguageSelectProps) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = languages.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, hsl(42 80% 8% / 0.2), transparent 45%), hsl(240 20% 3%)",
      }}
    >
      <div className="relative z-10 flex flex-col px-4 py-6 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="font-display text-sm font-bold tracking-[0.15em] text-primary">LEVEL UP CODE</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-xl border py-2 pl-9 pr-4 font-body text-xs text-foreground outline-none transition-all focus:border-primary/30"
              style={{ background: "hsl(240 15% 7% / 0.8)", borderColor: "hsl(42 100% 55% / 0.1)" }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-wide">
            Choose Your{" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Track
            </span>
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">Select a programming language to race</p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {filtered.map((lang, i) => (
            <motion.button
              key={lang.name}
              onClick={() => setSelected(lang.name)}
              className="relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all"
              style={{
                background: selected === lang.name
                  ? `${lang.color.replace(')', ' / 0.12)')}`
                  : "hsl(240 15% 7% / 0.6)",
                border: `1px solid ${selected === lang.name ? lang.color.replace(')', ' / 0.35)') : "hsl(42 100% 55% / 0.06)"}`,
                boxShadow: selected === lang.name ? `0 0 30px ${lang.color.replace(')', ' / 0.1)')}` : "none",
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{lang.icon}</span>
              <span className="font-body text-[11px] font-semibold text-foreground">{lang.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-center">
          <motion.button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className="relative overflow-hidden rounded-xl px-14 py-3 font-display text-sm font-bold tracking-[0.2em] disabled:opacity-25 disabled:cursor-not-allowed"
            style={{
              background: selected ? "linear-gradient(135deg, hsl(42 100% 55%), hsl(42 80% 45%))" : "hsl(240 15% 12%)",
              color: selected ? "hsl(240 20% 3%)" : "hsl(40 10% 50%)",
              boxShadow: selected ? "0 0 30px hsl(42 100% 55% / 0.2)" : "none",
            }}
            whileHover={selected ? { scale: 1.05 } : {}}
            whileTap={selected ? { scale: 0.95 } : {}}
          >
            START RACE
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSelect;
