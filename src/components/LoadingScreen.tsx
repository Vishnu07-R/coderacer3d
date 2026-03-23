import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  messages?: string[];
  duration?: number;
  onComplete: () => void;
}

const LoadingScreen = ({
  messages = ["COMPILING TRACK DATA...", "OPTIMIZING ALGORITHMS...", "INITIALIZING ENGINE..."],
  duration = 3000,
  onComplete,
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const stableOnComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, duration / 50);
    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(stableOnComplete, 400);
      return () => clearTimeout(t);
    }
  }, [progress, stableOnComplete]);

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 1200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, hsl(240 15% 6%), hsl(240 20% 3%) 80%)",
      }}
    >


      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Title */}
        <h1
          className="font-display text-2xl font-bold tracking-[0.2em]"
          style={{
            background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LEVEL UP CODE
        </h1>

        {/* Progress track */}
        <div className="w-72">
          <div className="mb-3 flex justify-between font-mono text-xs text-muted-foreground">
            <span>LOADING</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full" style={{ background: "hsl(240 15% 10%)", border: "1px solid hsl(42 100% 55% / 0.15)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, hsl(42 100% 55%), hsl(42 80% 65%), hsl(15 70% 55%))",
              }}
              transition={{ ease: "linear" }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 40%, hsl(0 0% 100% / 0.15) 50%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Car indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 text-[8px]"
              style={{ left: `${Math.min(progress, 94)}%` }}
            >
              🏎️
            </motion.div>
          </div>
          <div className="mt-1.5 flex justify-between">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="h-0.5 w-0.5 rounded-full"
                style={{ background: progress >= mark ? "hsl(42 100% 55%)" : "hsl(240 15% 20%)" }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
