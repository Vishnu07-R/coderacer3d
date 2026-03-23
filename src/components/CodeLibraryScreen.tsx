import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Search, Code, FileCode, Lightbulb } from "lucide-react";

interface CodeLibraryScreenProps {
  onBack: () => void;
}

const categories = [
  { id: "all", label: "ALL" },
  { id: "basics", label: "BASICS" },
  { id: "data", label: "DATA" },
  { id: "algorithms", label: "ALGO" },
  { id: "patterns", label: "PATTERNS" },
];

const resources = [
  { title: "Variables & Data Types", category: "basics", lang: "Python", difficulty: "Beginner", icon: "🐍", snippet: "x = 10\nname = 'Racer'\npi = 3.14" },
  { title: "Loops & Iteration", category: "basics", lang: "JavaScript", difficulty: "Beginner", icon: "⚡", snippet: "for (let i = 0; i < 10; i++) {\n  console.log(i);\n}" },
  { title: "Functions & Closures", category: "basics", lang: "TypeScript", difficulty: "Basic", icon: "📘", snippet: "const greet = (name: string): string => {\n  return `Hello, ${name}!`;\n}" },
  { title: "Arrays & Lists", category: "data", lang: "Python", difficulty: "Beginner", icon: "🐍", snippet: "fruits = ['apple', 'banana']\nfruits.append('cherry')" },
  { title: "Hash Maps", category: "data", lang: "Java", difficulty: "Medium", icon: "☕", snippet: 'Map<String, Integer> map = \n  new HashMap<>();\nmap.put("key", 1);' },
  { title: "Binary Search", category: "algorithms", lang: "C++", difficulty: "Medium", icon: "➕", snippet: "int binarySearch(vector<int>& arr,\n  int target) {\n  int l=0, r=arr.size()-1;\n}" },
  { title: "Sorting Algorithms", category: "algorithms", lang: "Python", difficulty: "Medium", icon: "🐍", snippet: "def quicksort(arr):\n  if len(arr) <= 1: return arr\n  pivot = arr[0]" },
  { title: "Singleton Pattern", category: "patterns", lang: "Java", difficulty: "Advanced", icon: "☕", snippet: "public class Singleton {\n  private static Singleton instance;\n}" },
  { title: "Observer Pattern", category: "patterns", lang: "TypeScript", difficulty: "Advanced", icon: "📘", snippet: "interface Observer {\n  update(data: any): void;\n}" },
];

const diffColors: Record<string, string> = {
  Beginner: "hsl(155 60% 45%)",
  Basic: "hsl(42 100% 55%)",
  Medium: "hsl(210 25% 65%)",
  Advanced: "hsl(15 70% 55%)",
};

const CodeLibraryScreen = ({ onBack }: CodeLibraryScreenProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.lang.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || r.category === category;
    return matchSearch && matchCat;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen flex-col overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 20%, hsl(220 50% 6% / 0.2), transparent 45%), hsl(240 20% 3%)" }}>
      <div className="relative z-10 flex flex-1 flex-col p-4 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={20} /></button>
          <BookOpen size={18} className="text-luxury-sapphire" />
          <h1 className="font-display text-xl font-bold tracking-[0.15em]" style={{ background: "linear-gradient(135deg, hsl(220 70% 60%), hsl(42 100% 55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Code Library</h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics, languages..." className="w-full rounded-xl py-2.5 pl-9 pr-4 font-body text-xs text-foreground outline-none" style={{ background: "hsl(240 15% 7% / 0.6)", border: "1px solid hsl(42 100% 55% / 0.06)" }} />
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className="whitespace-nowrap rounded-xl px-4 py-1.5 font-display text-[10px] font-bold tracking-[0.1em] transition-all" style={{ background: category === cat.id ? "hsl(42 100% 55% / 0.08)" : "hsl(240 15% 7% / 0.5)", border: `1px solid ${category === cat.id ? "hsl(42 100% 55% / 0.2)" : "hsl(42 100% 55% / 0.04)"}`, color: category === cat.id ? "hsl(42 100% 55%)" : "hsl(40 10% 50%)" }}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((res, i) => {
            const dc = diffColors[res.difficulty] || "hsl(42 100% 55%)";
            return (
              <motion.div key={res.title} className="group cursor-pointer rounded-xl p-4 transition-all" style={{ background: "hsl(240 15% 7% / 0.6)", border: "1px solid hsl(42 100% 55% / 0.06)" }} onClick={() => setExpanded(expanded === res.title ? null : res.title)} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.02, borderColor: "hsl(42 100% 55% / 0.15)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{res.icon}</span>
                    <div>
                      <h3 className="font-display text-xs font-bold text-foreground">{res.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body text-[10px] text-muted-foreground">{res.lang}</span>
                        <span className="rounded-full px-1.5 py-0.5 font-mono text-[9px]" style={{ background: `${dc.replace(')', ' / 0.08)')}`, color: dc, border: `1px solid ${dc.replace(')', ' / 0.2)')}` }}>{res.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <Code size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {expanded === res.title && (
                  <motion.div className="mt-3 rounded-xl p-3" style={{ background: "hsl(240 20% 4%)", border: "1px solid hsl(42 100% 55% / 0.06)" }} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
                    <pre className="font-mono text-[11px] text-luxury-emerald overflow-x-auto">{res.snippet}</pre>
                    <div className="mt-2 flex gap-2">
                      <button className="flex items-center gap-1 rounded-xl px-2 py-1 font-body text-[10px] transition-all" style={{ background: "hsl(42 100% 55% / 0.06)", border: "1px solid hsl(42 100% 55% / 0.12)", color: "hsl(42 100% 55%)" }}><FileCode size={10} /> Practice</button>
                      <button className="flex items-center gap-1 rounded-xl px-2 py-1 font-body text-[10px] transition-all" style={{ background: "hsl(15 70% 55% / 0.06)", border: "1px solid hsl(15 70% 55% / 0.12)", color: "hsl(15 70% 55%)" }}><Lightbulb size={10} /> Tutorial</button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeLibraryScreen;
