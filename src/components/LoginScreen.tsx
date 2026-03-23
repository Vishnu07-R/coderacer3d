import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, UserPlus, Loader2 } from "lucide-react";
import { setUserId } from "@/lib/userStore";
import { SERVER_URL } from "@/lib/api";

interface LoginScreenProps {
  onLogin: () => void;
  onCreateAccount: () => void;
}

const LoginScreen = ({ onLogin, onCreateAccount }: LoginScreenProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Using email field as username for now given the previous UI
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password })
      });
      
      const data = await res.json();
      if (data.status === "Success") {
        setUserId(data.user.id, data.user.username);
        onLogin();
      } else {
        setError(data.message || "Failed to login");
      }
    } catch (e) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, hsl(42 80% 12% / 0.3), transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(15 50% 12% / 0.2), transparent 50%), hsl(240 20% 3%)",
      }}
    >
      {/* Subtle ambient glow */}
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full opacity-6"
        style={{ background: "radial-gradient(circle, hsl(42 100% 55%), transparent 70%)", top: "-10%", right: "10%" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, hsl(240 15% 7% / 0.92), hsl(240 15% 10% / 0.75))",
          boxShadow: "0 0 80px hsl(42 100% 55% / 0.06), 0 30px 60px -15px hsl(0 0% 0% / 0.5)",
          border: "1px solid hsl(42 100% 55% / 0.1)",
          backdropFilter: "blur(20px)",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Gold accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.4), transparent)" }}
        />

        <div className="relative z-10">
          <div className="mb-8 text-center">
            <motion.h1
              className="font-display text-2xl font-bold tracking-[0.15em]"
              style={{
                background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Level Up Code
            </motion.h1>
            <p className="mt-2 font-mono text-xs tracking-widest text-muted-foreground">SIGN IN TO YOUR ACCOUNT</p>
            <div className="mx-auto mt-4 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.3), transparent)" }} />
          </div>

          <div className="space-y-5">
            {error && (
              <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}
            
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Username / Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border bg-background/50 px-4 py-3 font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:shadow-[0_0_25px_hsl(42_100%_55%/0.08)]"
                style={{ borderColor: "hsl(42 100% 55% / 0.12)" }}
                placeholder="ByteSlayer"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border bg-background/50 px-4 py-3 pr-10 font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:shadow-[0_0_25px_hsl(42_100%_55%/0.08)]"
                  style={{ borderColor: "hsl(42 100% 55% / 0.12)" }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              onClick={handleAuth}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full overflow-hidden rounded-xl py-3.5 font-display text-sm font-bold tracking-[0.2em] text-primary-foreground disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(42 100% 55%), hsl(42 80% 45%))",
                boxShadow: "0 0 30px hsl(42 100% 55% / 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                {loading ? <Loader2 size={16} className="animate-spin" /> : "SIGN IN"}
                {!loading && <ArrowRight size={16} />}
              </span>
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: "hsl(42 100% 55% / 0.1)" }} />
              <span className="font-mono text-[10px] text-muted-foreground">OR</span>
              <div className="h-px flex-1" style={{ background: "hsl(42 100% 55% / 0.1)" }} />
            </div>

            <motion.button
              onClick={onCreateAccount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full overflow-hidden rounded-xl py-3.5"
              style={{
                background: "hsl(15 70% 55% / 0.06)",
                border: "1px solid hsl(15 70% 55% / 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-display text-sm font-bold tracking-[0.2em]"
                style={{
                  background: "linear-gradient(135deg, hsl(15 70% 60%), hsl(42 100% 60%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                <UserPlus size={16} className="text-luxury-rose-gold" />
                CREATE ACCOUNT
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginScreen;
