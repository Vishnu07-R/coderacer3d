import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Wrench, Car, Flame, Star } from "lucide-react";

interface LevelSelectProps {
  language: string;
  onSelect: (level: string) => void;
  onBack: () => void;
}

const levels = [
  {
    id: "beginner", label: "BEGINNER", icon: Play, stars: 1,
    color: "hsl(155 60% 45%)",
    desc: "Start here! Learn fundamentals like variables, types, and basic syntax.",
  },
  {
    id: "basic", label: "BASIC", icon: Wrench, stars: 2,
    color: "hsl(42 100% 55%)",
    desc: "Build on basics with functions, arrays, and string manipulation.",
  },
  {
    id: "medium", label: "MEDIUM", icon: Car, stars: 3,
    color: "hsl(210 25% 65%)",
    desc: "Tackle OOP, data structures, and algorithms.",
  },
  {
    id: "advanced", label: "ADVANCED", icon: Flame, stars: 4,
    color: "hsl(15 70% 55%)",
    desc: "Master design patterns, concurrency, and system design.",
  },
];

const LevelSelect = ({ language, onSelect, onBack }: LevelSelectProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedLevel = levels.find((l) => l.id === selected);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, hsl(240 15% 7%), hsl(240 20% 3%) 70%)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-2xl">
        <button onClick={onBack} className="mb-6 self-start text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </button>

        <h1
          className="mb-2 font-display text-3xl font-bold tracking-[0.12em]"
          style={{
            background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Select Level
        </h1>
        <p className="mb-2 font-display text-lg font-bold tracking-[0.2em] text-foreground">DIFFICULTY</p>
        <p className="mb-10 font-body text-sm text-muted-foreground">Track: {language}</p>

        <div className="mb-6 flex w-full flex-wrap justify-center gap-4">
          {levels.map((level, i) => (
            <motion.button
              key={level.id}
              onClick={() => setSelected(level.id)}
              className="group relative flex h-40 w-36 flex-col items-center justify-center gap-3 rounded-2xl transition-all"
              style={{
                background: selected === level.id
                  ? `${level.color.replace(')', ' / 0.1)')}`
                  : "hsl(240 15% 7% / 0.7)",
                border: `1px solid ${selected === level.id ? level.color.replace(')', ' / 0.35)') : "hsl(42 100% 55% / 0.06)"}`,
                boxShadow: selected === level.id ? `0 0 35px ${level.color.replace(')', ' / 0.1)')}` : "none",
              }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${level.color.replace(')', ' / 0.08)')}` }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${level.color.replace(')', ' / 0.15)')}`, border: `1px solid ${level.color.replace(')', ' / 0.2)')}` }}>
                <level.icon className="h-5 w-5" style={{ color: level.color }} />
              </div>
              <span className="font-display text-[11px] font-bold tracking-[0.15em] text-foreground">{level.label}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Star
                    key={j}
                    size={10}
                    className={j < level.stars ? "text-primary" : "text-muted-foreground/20"}
                    fill={j < level.stars ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {selectedLevel && (
          <motion.div
            className="mb-6 w-full max-w-md rounded-xl px-5 py-3 text-center"
            style={{
              background: `${selectedLevel.color.replace(')', ' / 0.06)')}`,
              border: `1px solid ${selectedLevel.color.replace(')', ' / 0.15)')}`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-xs font-bold text-foreground tracking-wide">{selectedLevel.label}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{selectedLevel.desc}</p>
          </motion.div>
        )}

        <motion.button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="rounded-xl px-14 py-3 font-display text-sm font-bold tracking-[0.2em] disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            background: selected ? "linear-gradient(135deg, hsl(42 100% 55%), hsl(42 80% 45%))" : "hsl(240 15% 12%)",
            color: selected ? "hsl(240 20% 3%)" : "hsl(40 10% 50%)",
            boxShadow: selected ? "0 0 30px hsl(42 100% 55% / 0.2)" : "none",
          }}
          whileHover={selected ? { scale: 1.05 } : {}}
          whileTap={selected ? { scale: 0.95 } : {}}
        >
          CONTINUE
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LevelSelect;
