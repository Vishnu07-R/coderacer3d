import { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen = ({ onStart }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onStart, 3000);
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, hsl(240 15% 8%), hsl(240 20% 3%) 70%)",
      }}
    >
      {/* Elegant ambient orbs */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(42 100% 55%), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, hsl(15 70% 55%), transparent 70%)", left: "15%", top: "65%" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      {/* Floating gold particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${8 + (i * 6) % 84}%`,
            top: `${12 + (i * 5.3) % 76}%`,
            background: `hsl(42 ${60 + i * 3}% ${50 + i * 2}% / 0.5)`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.25 }}
        />
      ))}

      {/* Main logo area */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Gold glow behind logo */}
          <motion.div
            className="absolute -inset-12 rounded-3xl"
            style={{
              background: "radial-gradient(circle, hsl(42 100% 55% / 0.08), transparent 70%)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Logo text */}
          <div className="relative text-center">
            <motion.h1
              className="font-display text-5xl font-bold tracking-[0.15em] md:text-7xl"
              style={{
                background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 55%), hsl(35 80% 45%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px hsl(42 100% 55% / 0.3))",
              }}
            >
              LEVEL UP
            </motion.h1>
            <motion.h2
              className="font-display text-3xl font-bold tracking-[0.3em] md:text-4xl -mt-1"
              style={{
                background: "linear-gradient(135deg, hsl(210 25% 75%), hsl(210 25% 60%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CODE
            </motion.h2>

            {/* Decorative line */}
            <motion.div
              className="mx-auto mt-4 h-px w-32"
              style={{ background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.6), transparent)" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* Racing car */}
          <motion.div
            className="mt-5 flex items-center justify-center gap-3"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              className="h-px w-20"
              style={{ background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.5))" }}
              animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-2xl">🏎️</span>
            <motion.div
              className="h-px w-20"
              style={{ background: "linear-gradient(90deg, hsl(15 70% 55% / 0.5), transparent)" }}
              animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mb-10 font-mono text-[11px] tracking-[0.4em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          RACE · CODE · CONQUER
        </motion.p>

        {/* Start button */}
        <motion.button
          onClick={onStart}
          className="relative overflow-hidden rounded-xl px-12 py-3.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, hsl(42 100% 55% / 0.12), hsl(15 70% 55% / 0.08))",
              border: "1px solid hsl(42 100% 55% / 0.3)",
            }}
          />
          <span className="relative font-display text-sm font-bold tracking-[0.3em] text-primary">
            ENTER
          </span>
        </motion.button>

        <motion.p
          className="mt-8 font-mono text-[10px] text-muted-foreground/50"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        >
          AUTO-STARTING IN 3 SECONDS...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
