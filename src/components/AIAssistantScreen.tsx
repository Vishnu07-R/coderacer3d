import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Bot, User, Sparkles, BookOpen, Gamepad2, Wrench, Terminal, Code2, Coffee, ShieldAlert, Cpu } from "lucide-react";
import { getUserStats } from "@/lib/userStore";
import { AI_KNOWLEDGE_STAGES } from "@/lib/aiKnowledge";

interface AIAssistantScreenProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
  status?: "unlocked" | "restricted" | "mastered";
}

const quickPrompts = [
  { icon: Gamepad2, label: "Race Tips", prompt: "How do I start a race and improve my score?" },
  { icon: Wrench, label: "Customize", prompt: "How do I customize my car in the garage?" },
  { icon: Code2, label: "Python tips", prompt: "Give me some Python tips for beginners." },
  { icon: Coffee, label: "Java basics", prompt: "Tell me about Java's main pillars." },
];

const responses: Record<string, string> = {
  race: "🏎️ To dominate the track, head to the Lobby and tap **'START RACE'**. \n\nTips for high scores:\n• Choose a safe language for consistent wins.\n• Correct answers give massive **SPEED BOOSTS**.\n• Faster answers = higher multiplier!",
  customize: "🛠️ The Garage is your mechanical playground! \n\nAvailable customizations:\n• Neon underglow (boost visibility)\n• High-gloss paint colors\n• Aerodynamic spoilers\n\nYou earn coins by winning races to unlock the rarest parts!",
  python: "🐍 Python is like clear, efficient poetry. \n\nKey areas to master for the race:\n• **List Comprehensions** for fast transformations.\n• **Decorators** for advanced logic.\n• **GIL** (Global Interpreter Lock) fundamentals.",
  java: "☕ Java is robust and powerful. \n\nFocus on these for the race:\n1. **Encapsulation**: Private fields, public methods.\n2. **Inheritance**: Reuse code effectively.\n3. **Polymorphism**: One interface, many forms.",
  javascript: "⚡ JavaScript makes the web (and this race!) alive.\n\nMaster these:\n• **Promises & Async/Await** for smooth operations.\n• **Closures** for data privacy.\n• **ES6+ features** like destructuring for cleaner code.",
  default: "🚀 Greetings, Racer! I am your AI Co-Pilot. \n\nI can help you with:\n• **Racing Techniques**\n• **Car Engineering**\n• **Code Mastery** (Python, JS, Java, etc.)\n\nWhat knowledge shall we download to your brain today?",
};

const getResponseStatus = (input: string, currentStage: number): "unlocked" | "restricted" => {
  const lower = input.toLowerCase();
  
  // Logic restricted by Stage level
  if ((lower.includes("python") || lower.includes("java") || lower.includes("javascript")) && currentStage < 4) return "restricted";
  if ((lower.includes("async") || lower.includes("await") || lower.includes("promise")) && currentStage < 7) return "restricted";
  if ((lower.includes("algorithm") || lower.includes("complexity") || lower.includes("sorting")) && currentStage < 8) return "restricted";
  
  return "unlocked";
};

const findBestResponse = (input: string, currentStage: number): { text: string; status: "unlocked" | "restricted" } => {
  const lower = input.toLowerCase();
  const status = getResponseStatus(input, currentStage);

  if (status === "restricted") {
    const nextStageLevel = AI_KNOWLEDGE_STAGES.find(s => s.topics.some(t => lower.includes(t.toLowerCase())))?.level || currentStage + 1;
    return {
      text: `⚠️ **ACCESS DENIED** ⚠️\n\nYour current clearance at **Stage ${currentStage}** is insufficient to access this data packet.\n\nPlease reach Level **${Math.max(1, (nextStageLevel - 1) * 2)}** in the main race to unlock **Stage ${nextStageLevel}: ${AI_KNOWLEDGE_STAGES[nextStageLevel - 1]?.title || 'Higher Intelligence'}**.`,
      status
    };
  }

  let text = responses.default;
  if (lower.includes("race") || lower.includes("score") || lower.includes("tip")) text = responses.race;
  else if (lower.includes("custom") || lower.includes("garag") || lower.includes("car")) text = responses.customize;
  else if (lower.includes("python")) text = responses.python;
  else if (lower.includes("java") && !lower.includes("javascript")) text = responses.java;
  else if (lower.includes("javascript") || lower.includes("js")) text = responses.javascript;

  return { text, status };
};

const AIAssistantScreen = ({ onBack }: AIAssistantScreenProps) => {
  const stats = getUserStats();
  const currentStageLevel = Math.min(10, Math.floor(stats.level / 2) + 1);
  const currentStageInfo = AI_KNOWLEDGE_STAGES[currentStageLevel - 1] || AI_KNOWLEDGE_STAGES[0];

  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", text: responses.default }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const simulateStreaming = (fullText: string, statusOverride: "unlocked" | "restricted") => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, role: "assistant", text: "", isStreaming: true, status: statusOverride }]);
    
    let currentText = "";
    const words = fullText.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setMessages(prev => prev.map(m => m.id === id ? { ...m, text: currentText } : m));
        i++;
      } else {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isStreaming: false } : m));
        clearInterval(interval);
      }
    }, 30);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Dynamic "thinking" time based on query complexity
    setTimeout(() => {
      setIsThinking(false);
      const res = findBestResponse(text, currentStageLevel);
      simulateStreaming(res.text, res.status);
    }, 800 + Math.random() * 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.02 }} 
      className="flex min-h-screen flex-col overflow-hidden bg-background"
      style={{ background: "radial-gradient(circle at 50% 10%, hsl(42 80% 5% / 0.4), transparent 60%), hsl(240 20% 3%)" }}
    >
      <div className="relative z-10 flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition-all active:scale-95"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-2xl" 
                style={{ 
                  background: "linear-gradient(135deg, hsl(42 100% 55%), hsl(15 70% 55%))", 
                  boxShadow: "0 0 25px hsl(42 100% 55% / 0.25)" 
                }}
                animate={{ 
                  y: [0, -4, 0],
                  boxShadow: ["0 0 20px hsl(42 100% 55% / 0.2)", "0 0 40px hsl(42 100% 55% / 0.4)", "0 0 20px hsl(42 100% 55% / 0.2)"] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot size={22} className="text-black" />
              </motion.div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wider text-white">ORBITAI</h1>
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500/80">Clearance: Level {currentStageLevel}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
              <p className="font-mono text-[10px] text-muted-foreground uppercase opacity-60">Knowledge Core</p>
              <h2 className="font-display text-xs font-bold text-primary tracking-widest">{currentStageInfo.title}</h2>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div 
              className="h-full bg-primary shadow-[0_0_10px_hsl(42_100%_55%)]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStageLevel / 10) * 100}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
          <span className="font-mono text-[9px] text-muted-foreground whitespace-nowrap">{currentStageLevel} / 10 STAGES</span>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className={`flex-shrink-0 flex items-end mb-1`}>
                  {msg.role === "assistant" ? (
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${msg.status === 'restricted' ? 'bg-luxury-ruby/10 border-luxury-ruby/20' : 'bg-primary/10 border-primary/20'}`}>
                      <Bot size={16} className={msg.status === 'restricted' ? 'text-luxury-ruby' : 'text-primary'} />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-xl bg-luxury-rose-gold/10 flex items-center justify-center border border-luxury-rose-gold/20">
                      <User size={16} className="text-luxury-rose-gold" />
                    </div>
                  )}
                </div>
                
                <div 
                  className={`relative max-w-[85%] md:max-w-[70%] group`}
                >
                  <div 
                    className={`px-5 py-3.5 rounded-2xl font-body text-[14px] leading-relaxed backdrop-blur-md shadow-2xl transition-all
                      ${msg.role === "user" 
                        ? "bg-primary/5 border border-primary/20 rounded-tr-none text-primary-foreground" 
                        : msg.status === 'restricted'
                          ? "bg-luxury-ruby/5 border border-luxury-ruby/30 rounded-tl-none text-luxury-ruby/90 italic"
                          : "bg-surface-dark/80 border border-white/5 rounded-tl-none text-foreground/90"
                      }`}
                  >
                    {msg.status === 'restricted' && <ShieldAlert size={14} className="mb-2 text-luxury-ruby" />}
                    {msg.text || (msg.isStreaming && <span className="animate-pulse">|</span>)}
                  </div>
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div 
                className="flex gap-4 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="flex gap-1.5 px-4 py-3 rounded-2xl bg-surface-dark/40 border border-white/5">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input & Actions */}
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((qp) => (
              <button 
                key={qp.label} 
                onClick={() => handleSendMessage(qp.prompt)} 
                disabled={isThinking}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-mono border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary disabled:opacity-50"
              >
                <qp.icon size={12} />
                {qp.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center group">
            <div className="absolute left-4 text-muted-foreground/40 group-focus-within:text-primary/60 transition-colors">
              <Terminal size={18} />
            </div>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)} 
              disabled={isThinking}
              placeholder="Inject command or ask for logic..." 
              className="w-full bg-surface-dark/60 border border-white/10 rounded-2xl pl-12 pr-16 py-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30 disabled:opacity-50"
            />
            <button 
              onClick={() => handleSendMessage(input)} 
              disabled={!input.trim() || isThinking}
              className="absolute right-2 p-2.5 rounded-xl bg-primary text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="flex justify-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <Cpu size={10} className="text-primary" />
              <p className="text-[9px] text-muted-foreground font-mono tracking-widest uppercase italic">
                Quantized Neural Core: {stats.totalCorrect} Correct Solves
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistantScreen;
