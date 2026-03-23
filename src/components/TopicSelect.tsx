import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";

interface TopicSelectProps {
  language: string;
  level: string;
  onSelect: (topic: string) => void;
  onBack: () => void;
}

const topicsByLevel: Record<string, { name: string; count: number; color: string }[]> = {
  beginner: [
    { name: "VARIABLES & TYPES", count: 5, color: "hsl(155 60% 45%)" },
    { name: "OPERATORS", count: 5, color: "hsl(210 25% 65%)" },
    { name: "CONDITIONAL LOGIC", count: 5, color: "hsl(350 65% 50%)" },
    { name: "LOOPS & ITERATION", count: 6, color: "hsl(42 100% 55%)" },
    { name: "INPUT / OUTPUT", count: 4, color: "hsl(15 70% 55%)" },
  ],
  basic: [
    { name: "FUNCTIONS", count: 6, color: "hsl(42 100% 55%)" },
    { name: "ARRAYS & LISTS", count: 5, color: "hsl(155 60% 45%)" },
    { name: "STRING MANIPULATION", count: 7, color: "hsl(210 25% 65%)" },
    { name: "ERROR HANDLING", count: 4, color: "hsl(350 65% 50%)" },
    { name: "SCOPE & CLOSURES", count: 5, color: "hsl(15 70% 55%)" },
  ],
  medium: [
    { name: "OOP FUNDAMENTALS", count: 8, color: "hsl(220 70% 55%)" },
    { name: "DATA STRUCTURES", count: 6, color: "hsl(155 60% 45%)" },
    { name: "ALGORITHMS", count: 7, color: "hsl(42 100% 55%)" },
    { name: "FILE I/O", count: 5, color: "hsl(15 70% 55%)" },
    { name: "RECURSION", count: 5, color: "hsl(210 25% 65%)" },
  ],
  advanced: [
    { name: "DESIGN PATTERNS", count: 6, color: "hsl(42 100% 55%)" },
    { name: "CONCURRENCY", count: 5, color: "hsl(350 65% 50%)" },
    { name: "OPTIMIZATION", count: 7, color: "hsl(155 60% 45%)" },
    { name: "SYSTEM DESIGN", count: 8, color: "hsl(210 25% 65%)" },
    { name: "TESTING & TDD", count: 5, color: "hsl(15 70% 55%)" },
  ],
};

const TopicSelect = ({ language, level, onSelect, onBack }: TopicSelectProps) => {
  const topics = topicsByLevel[level] || topicsByLevel.beginner;
  const totalChallenges = topics.reduce((s, t) => s + t.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 20%, hsl(240 15% 7%), hsl(240 20% 3%) 70%)",
      }}
    >
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-4">
        <h1
          className="mb-1 font-display text-2xl font-bold tracking-[0.12em]"
          style={{
            background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Select Topic
        </h1>
        <p className="mb-8 font-body text-sm text-muted-foreground">
          {language} · {level.toUpperCase()} — Choose your course
        </p>

        <div className="mb-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {topics.map((topic, i) => (
            <motion.button
              key={topic.name}
              onClick={() => onSelect(topic.name)}
              className="group flex items-center justify-between rounded-xl p-5 transition-all"
              style={{
                background: `${topic.color.replace(')', ' / 0.05)')}`,
                border: `1px solid ${topic.color.replace(')', ' / 0.12)')}`,
              }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -2, boxShadow: `0 0 25px ${topic.color.replace(')', ' / 0.08)')}` }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-left">
                <h3 className="font-display text-[11px] font-bold tracking-[0.1em] text-foreground group-hover:text-primary transition-colors">
                  {topic.name}
                </h3>
                <p className="font-body text-xs text-muted-foreground">{topic.count} challenges</p>
              </div>
              <div className="text-lg opacity-40 group-hover:opacity-80 transition-opacity">🏁</div>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => onSelect("ALL")}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl p-4 transition-all"
          style={{
            background: "hsl(42 100% 55% / 0.05)",
            border: "1px solid hsl(42 100% 55% / 0.15)",
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 25px hsl(42 100% 55% / 0.08)" }}
        >
          <Zap className="text-primary" size={16} />
          <span className="font-display text-[11px] font-bold tracking-[0.15em] text-primary">RACE ALL TOPICS</span>
          <span className="rounded-full px-3 py-0.5 font-mono text-[10px] text-muted-foreground" style={{ background: "hsl(240 15% 12%)" }}>
            {totalChallenges} challenges
          </span>
        </motion.button>

        <button onClick={onBack} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Difficulty
        </button>
      </div>
    </motion.div>
  );
};

export default TopicSelect;
