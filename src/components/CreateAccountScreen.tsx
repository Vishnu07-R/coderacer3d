import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Rocket, ArrowLeft, Loader2 } from "lucide-react";
import { setUserId } from "@/lib/userStore";
import { SERVER_URL } from "@/lib/api";

interface CreateAccountScreenProps {
  onRegister: () => void;
  onBack: () => void;
}

const CreateAccountScreen = ({ onRegister, onBack }: CreateAccountScreenProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (data.status === "Success") {
        setUserId(data.user.id, data.user.username);
        onRegister();
      } else {
        setError(data.message || "Failed to register");
      }
    } catch (e) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border bg-background/50 px-4 py-3 font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:shadow-[0_0_25px_hsl(42_100%_55%/0.08)]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 60% 20%, hsl(15 50% 12% / 0.3), transparent 50%), radial-gradient(ellipse at 30% 80%, hsl(42 80% 12% / 0.2), transparent 50%), hsl(240 20% 3%)",
      }}
    >
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full opacity-6"
        style={{ background: "radial-gradient(circle, hsl(15 70% 55%), transparent 70%)", top: "5%", left: "10%" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, hsl(240 15% 7% / 0.92), hsl(240 15% 10% / 0.75))",
          boxShadow: "0 0 80px hsl(15 70% 55% / 0.05), 0 30px 60px -15px hsl(0 0% 0% / 0.5)",
          border: "1px solid hsl(15 70% 55% / 0.1)",
          backdropFilter: "blur(20px)",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute top-0 left-8 right-8 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(15 70% 55% / 0.4), hsl(42 100% 55% / 0.3), transparent)" }} />

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> BACK
          </button>

          <div className="mb-6 text-center">
            <motion.h1
              className="font-display text-2xl font-bold tracking-[0.15em]"
              style={{
                background: "linear-gradient(135deg, hsl(15 70% 60%), hsl(42 100% 60%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Account
            </motion.h1>
            <p className="mt-2 font-mono text-xs text-muted-foreground tracking-widest">JOIN THE RACE</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} style={{ borderColor: "hsl(42 100% 55% / 0.12)" }} placeholder="YourRacerName" />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} style={{ borderColor: "hsl(42 100% 55% / 0.12)" }} placeholder="racer@levelup.io" />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + " pr-10"} style={{ borderColor: "hsl(42 100% 55% / 0.12)" }} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} style={{ borderColor: "hsl(42 100% 55% / 0.12)" }} placeholder="••••••••" />
            </div>

            <motion.button
              onClick={handleRegister}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative mt-2 w-full overflow-hidden rounded-xl py-3.5 font-display text-sm font-bold tracking-[0.2em] text-primary-foreground disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(15 70% 55%), hsl(42 100% 55%))",
                boxShadow: "0 0 30px hsl(15 70% 55% / 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                REGISTER
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAccountScreen;
