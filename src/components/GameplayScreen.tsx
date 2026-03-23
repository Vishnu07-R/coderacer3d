import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, Trophy, Check, X, Gauge, ChevronLeft, ChevronRight, Flag, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";
import RacingScene from "./game/RacingScene";
import { SFX } from "@/lib/sounds";
import { getChallenges, type Challenge } from "@/lib/challenges";
import { useRacingSync } from "@/hooks/useRacingSync";

interface GameplayScreenProps {
  language: string;
  level: string;
  topic: string;
  onFinish: () => void;
}

const GameplayScreen = ({ language, level, topic, onFinish }: GameplayScreenProps) => {
  const [speed, setSpeed] = useState(60);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [boost, setBoost] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [racePosition, setRacePosition] = useState(3);
  const [totalDistance, setTotalDistance] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [challenges] = useState<Challenge[]>(() => getChallenges(language, level, 10));
  
  // Real-time Sync
  const roomName = `${language}-${level}`.toLowerCase();
  const { otherPlayers, isConnected, syncMyPosition, sendNitroBoost } = useRacingSync(roomName);

  useEffect(() => {
    if (!raceFinished) {
      syncMyPosition(playerPosition);
    }
  }, [playerPosition, syncMyPosition, raceFinished]);

  useEffect(() => {
    if (raceFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) { setRaceFinished(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [raceFinished]);

  useEffect(() => {
    if (raceFinished) return;
    const interval = setInterval(() => {
      setTotalDistance(d => d + speed * 0.01);
      setRacePosition(prev => {
        if (speed > 100) return Math.max(1, prev - (Math.random() > 0.7 ? 1 : 0));
        if (speed < 50) return Math.min(5, prev + (Math.random() > 0.7 ? 1 : 0));
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [speed, raceFinished]);

  useEffect(() => {
    if (boost <= 0) return;
    const interval = setInterval(() => {
      setBoost((prev) => Math.max(0, prev - 1));
      setSpeed((prev) => Math.max(60, prev - 1.5));
    }, 150);
    return () => clearInterval(interval);
  }, [boost]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPlayerPosition((p) => Math.max(-1, p - 0.15));
      if (e.key === "ArrowRight") setPlayerPosition((p) => Math.min(1, p + 0.15));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      setPlayerPosition((p) => Math.max(-1, Math.min(1, p + dx * 0.002)));
      startX = e.touches[0].clientX;
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchmove", onMove);
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchmove", onMove); };
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    const correct = answerIndex === challenges[questionIndex].answer;
    setShowResult(correct ? "correct" : "wrong");

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const comboMultiplier = Math.min(newCombo, 5);
      setScore((s) => s + (100 + boost * 10) * comboMultiplier);
      setBoost(20);
      setSpeed(130 + newCombo * 5);
      
      // Track correct answers for AI level system
      import("@/lib/userStore").then(m => m.incrementCorrectAnswers(1));

      if (soundEnabled) {
        SFX.correct();
        SFX.boost();
        if (newCombo >= 3) setTimeout(() => SFX.combo(), 200);
      }
    } else {
      setCombo(0);
      setSpeed(35);
      if (soundEnabled) SFX.wrong();
    }

    setTimeout(() => {
      setShowResult(null);
      if (questionIndex < challenges.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        setRaceFinished(true);
        // Save race results to user store
        import("@/lib/userStore").then(async m => { // Changed to async
          const isPerfect = racePosition === 1 && combo >= 5;
          const coinsEarned = (questionIndex * 15) + (racePosition === 1 ? 150 : 50) + (isPerfect ? 100 : 0);
          const rewardPointsEarned = Math.floor(score / 5);

          await m.addRewards(coinsEarned, rewardPointsEarned); // Await addRewards
          m.addExp(Math.floor(score / 2));
          m.recordWin(isPerfect);
        });
        if (soundEnabled) SFX.victory();
      }
    }, 1200);
  }, [questionIndex, challenges, boost, combo, soundEnabled, score, racePosition, sendNitroBoost]); // Added sendNitroBoost to dependencies

  const positionSuffix = (p: number) => p === 1 ? "ST" : p === 2 ? "ND" : p === 3 ? "RD" : "TH";

  if (raceFinished) {
    const finalPos = Math.round(racePosition); // Use finalPos
    const grade = finalPos === 1 ? "🏆 CHAMPION!" : finalPos <= 3 ? "🥈 PODIUM FINISH!" : "🏁 RACE OVER";
    const coinsEarned = (questionIndex * 15) + (finalPos === 1 ? 150 : 50) + (finalPos === 1 && combo >= 5 ? 100 : 0); // Use finalPos
    const rewardPointsEarned = Math.floor(score / 5);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-screen flex-col items-center justify-center bg-background"
      >
        <motion.div
          className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{ background: "hsl(240 15% 7% / 0.9)", border: "1px solid hsl(42 100% 55% / 0.15)" }}
          initial={{ scale: 0.5, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <Trophy size={48} className="mx-auto mb-3 text-primary" />
          <h1 className="mb-1 font-display text-xl font-bold text-primary text-glow-gold">{grade}</h1>
          <p className="mb-1 font-display text-3xl font-bold text-primary">
            {finalPos}{positionSuffix(finalPos)} PLACE
          </p>
          <p className="mb-6 font-body text-sm text-muted-foreground">
            {language} · {level.toUpperCase()} · {topic}
          </p>

          <div className="mb-4 grid grid-cols-2 gap-3">
            {[
              { label: "COINS", value: `+${coinsEarned}`, color: "text-primary" },
              { label: "R-POINTS", value: `+${rewardPointsEarned}`, color: "text-luxury-platinum" },
              { label: "MAX COMBO", value: `x${combo}`, color: "text-luxury-rose-gold" },
              { label: "XP EARNED", value: `+${Math.floor(score / 2)}`, color: "text-luxury-emerald" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-3" style={{ background: "hsl(240 15% 10%)", border: "1px solid hsl(42 100% 55% / 0.06)" }}>
                <p className="font-mono text-[10px] text-muted-foreground">{stat.label}</p>
                <p className={`font-display text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-xl p-3" style={{ background: "hsl(42 100% 55% / 0.05)", border: "1px solid hsl(42 100% 55% / 0.12)" }}>
            <p className="font-mono text-[10px] text-primary">DISTANCE</p>
            <p className="font-display text-lg font-bold text-primary">{totalDistance.toFixed(1)} KM</p>
          </div>

          <motion.button
            onClick={onFinish}
            className="w-full rounded-xl py-3 font-display text-sm font-bold tracking-[0.2em] text-primary-foreground"
            style={{ background: "linear-gradient(135deg, hsl(42 100% 55%), hsl(42 80% 45%))" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            RETURN TO LOBBY
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-screen flex-col bg-background overflow-hidden"
    >
      {/* HUD */}
      <div className="relative z-20 flex items-center justify-between px-3 py-1.5" style={{ background: "hsl(240 15% 5% / 0.9)", borderBottom: "1px solid hsl(42 100% 55% / 0.08)", backdropFilter: "blur(10px)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg px-2 py-0.5" style={{ background: "hsl(42 100% 55% / 0.08)" }}>
            <Flag size={11} className="text-primary" />
            <span className="font-display text-sm font-bold text-primary">{racePosition}{positionSuffix(racePosition)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={11} className="text-luxury-platinum" />
            <span className="font-mono text-xs text-foreground">{Math.round(speed)}</span>
            <span className="font-mono text-[8px] text-muted-foreground">KM/H</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {combo > 1 && (
            <motion.div
              className="rounded-lg px-2 py-0.5"
              style={{ background: "hsl(15 70% 55% / 0.12)" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              key={combo}
            >
              <span className="font-display text-xs font-bold text-luxury-rose-gold">x{combo}</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={11} className={timeLeft <= 15 ? "text-luxury-ruby" : "text-luxury-rose-gold"} />
            <span className={`font-mono text-sm font-bold ${timeLeft <= 15 ? "text-luxury-ruby animate-pulse" : "text-foreground"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={11} className="text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{score}</span>
          </div>
          <button onClick={() => setSoundEnabled(s => !s)} className="text-muted-foreground hover:text-primary transition-colors">
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>
      </div>

      {/* Boost bar */}
      <div className="relative z-20 h-1" style={{ background: "hsl(240 15% 8%)" }}>
        <motion.div
          className="h-full"
          style={{
            width: `${(boost / 20) * 100}%`,
            background: boost > 10
              ? "linear-gradient(90deg, hsl(15 70% 55%), hsl(42 100% 55%), hsl(15 70% 55%))"
              : "linear-gradient(90deg, hsl(42 100% 55%), hsl(42 80% 65%))",
          }}
          animate={boost > 10 ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 0.2, repeat: Infinity }}
        />
      </div>

      {/* 3D Scene */}
      <div className="relative flex-1 min-h-0">
        <RacingScene speed={speed} playerPosition={playerPosition} boosting={boost > 0} />

        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between pointer-events-none md:hidden">
          <motion.button
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "hsl(240 15% 7% / 0.5)", border: "1px solid hsl(42 100% 55% / 0.15)", backdropFilter: "blur(8px)" }}
            onTouchStart={() => setPlayerPosition((p) => Math.max(-1, p - 0.2))}
            whileTap={{ scale: 0.85 }}
          >
            <ChevronLeft size={22} className="text-primary" />
          </motion.button>
          <motion.button
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "hsl(240 15% 7% / 0.5)", border: "1px solid hsl(42 100% 55% / 0.15)", backdropFilter: "blur(8px)" }}
            onTouchStart={() => setPlayerPosition((p) => Math.min(1, p + 0.2))}
            whileTap={{ scale: 0.85 }}
          >
            <ChevronRight size={22} className="text-primary" />
          </motion.button>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex flex-col items-center gap-2 rounded-2xl px-10 py-5"
                style={{
                  background: showResult === "correct" ? "hsl(155 60% 45% / 0.15)" : "hsl(350 65% 50% / 0.15)",
                  border: `2px solid ${showResult === "correct" ? "hsl(155 60% 45% / 0.4)" : "hsl(350 65% 50% / 0.4)"}`,
                  backdropFilter: "blur(10px)",
                  color: showResult === "correct" ? "hsl(155 60% 55%)" : "hsl(350 65% 60%)",
                }}
                initial={{ scale: 0.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  {showResult === "correct" ? <Check size={26} /> : <X size={26} />}
                  <span className="font-display text-xl font-bold">
                    {showResult === "correct" ? "BOOST!" : "MISS!"}
                  </span>
                  {showResult === "correct" && <Zap size={22} className="text-primary" />}
                </div>
                {showResult === "correct" && combo > 1 && (
                  <span className="font-display text-sm font-bold text-luxury-rose-gold">🔥 {combo}x COMBO</span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Challenge panel */}
      <div className="relative z-20 px-3 py-3" style={{ background: "hsl(240 15% 5% / 0.92)", borderTop: "1px solid hsl(42 100% 55% / 0.08)", backdropFilter: "blur(10px)" }}>
        <div className="mx-auto max-w-2xl">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">Q{questionIndex + 1}/{challenges.length}</span>
              <div className="flex gap-0.5">
                {challenges.map((_, i) => (
                  <div key={i} className="h-1 w-3 rounded-full" style={{ background: i < questionIndex ? "hsl(155 60% 45%)" : i === questionIndex ? "hsl(42 100% 55%)" : "hsl(240 15% 15%)" }} />
                ))}
              </div>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-primary">
              <Zap size={10} /> SOLVE = BOOST
            </span>
          </div>
          <p className="mb-2 font-display text-sm font-bold text-foreground leading-tight">
            {challenges[questionIndex].question}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {challenges[questionIndex].options.map((opt, i) => (
              <motion.button
                key={`${questionIndex}-${i}`}
                onClick={() => !showResult && handleAnswer(i)}
                disabled={!!showResult}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-body text-xs text-foreground transition-all disabled:opacity-40 active:scale-95"
                style={{
                  background: "hsl(240 15% 7% / 0.7)",
                  border: "1px solid hsl(42 100% 55% / 0.06)",
                }}
                whileHover={!showResult ? { scale: 1.02, borderColor: "hsl(42 100% 55% / 0.2)" } : {}}
                whileTap={!showResult ? { scale: 0.96 } : {}}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg font-display text-[10px] font-bold text-primary" style={{ background: "hsl(42 100% 55% / 0.08)" }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-left">{opt}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameplayScreen;
