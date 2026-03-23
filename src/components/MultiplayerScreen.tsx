import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Play, ArrowLeft, Loader2, Trophy, Car } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { getUserStats, getUserName } from "@/lib/userStore";
import { SERVER_URL } from "@/lib/api";

interface MultiplayerScreenProps {
  onBack: () => void;
  onRaceStart?: (roomCode: string) => void;
}

const MultiplayerScreen = ({ onBack, onRaceStart }: MultiplayerScreenProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mode, setMode] = useState<"menu" | "lobby" | "joining">("menu");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [players, setPlayers] = useState<{ id: string, name: string, car: string, ready: boolean }[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState("");
  
  const stats = getUserStats();

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✓ Connected to server");
      setIsConnected(true);
      setError("");
    });

    newSocket.on("connect_error", (error) => {
      console.error("✗ Connection error:", error);
      setError(`Connection error: ${error.message}`);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("✗ Disconnected from server:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        setError("Server disconnected. Attempting to reconnect...");
      }
    });

    newSocket.on("lobby-created", (data) => {
      setRoomCode(data.roomCode);
      setIsHost(true);
      setPlayers(data.players);
      setMode("lobby");
    });

    newSocket.on("lobby-updated", (data) => {
      setRoomCode(data.roomCode || roomCode);
      setPlayers(data.players);
      if (data.host === newSocket.id) setIsHost(true);
    });

    newSocket.on("lobby-error", (msg) => {
      setError(msg);
      setMode("menu");
    });

    newSocket.on("race-countdown", (count) => {
      setCountdown(count);
    });

    newSocket.on("race-start", () => {
      if (onRaceStart) onRaceStart(roomCode);
      else console.log("RACE STARTED IN MULTIPLAYER SCREEN");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomCode, onRaceStart]);

  const handleCreate = () => {
    if (socket && isConnected) {
      // Pass equippedCar if available, defaulting to standard
      socket.emit("create-lobby", { username: getUserName(), equippedCar: "standard" });
    } else {
      setError("Not connected to server. Please wait...");
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && isConnected && joinCode.trim().length === 4) {
      setRoomCode(joinCode.toUpperCase());
      socket.emit("join-lobby", { roomCode: joinCode, username: getUserName(), equippedCar: "standard" });
      setMode("lobby");
    } else if (!isConnected) {
      setError("Not connected to server. Please wait...");
    }
  };

  const handleStartRace = () => {
    if (socket && isHost && players.length > 1) {
      socket.emit("start-race-countdown", roomCode);
    }
  };

  const handleRetryConnection = () => {
    setError("");
    if (socket) {
      socket.connect();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 50%, hsl(240 20% 10%), hsl(240 25% 4%))" }}
    >
      <button onClick={onBack} className="absolute top-6 left-6 text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft size={24} />
      </button>

      <div className="z-10 w-full max-w-md">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 pt-1 border border-primary/30">
            <Users size={32} className="text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-widest text-white">MULTIPLAYER</h1>
          <p className="text-muted-foreground mt-2">Race live against real opponents</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs text-muted-foreground">{isConnected ? 'CONNECTED' : 'CONNECTING...'}</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-center text-sm bg-red-950/50 p-3 rounded-lg flex items-center justify-between gap-2"
                >
                  <span className="flex-1">{error}</span>
                  {!isConnected && (
                    <button 
                      onClick={handleRetryConnection}
                      className="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded whitespace-nowrap"
                    >
                      RETRY
                    </button>
                  )}
                </motion.div>
              )}
              
              <button onClick={handleCreate} disabled={!isConnected} className="group relative overflow-hidden rounded-xl bg-primary px-6 py-4 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex items-center justify-center gap-3">
                  <Play size={20} className="text-white" />
                  <span className="font-display text-lg font-bold text-white tracking-wider">CREATE LOBBY</span>
                </div>
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center"><span className="bg-[#0f0f13] px-4 text-xs tracking-widest text-muted-foreground">OR</span></div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <form onSubmit={handleJoin} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ENTER 4-DIGIT CODE"
                    className="flex-1 rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-center font-mono text-xl font-bold text-white tracking-[0.2em] outline-none focus:border-primary transition-colors uppercase placeholder:text-muted-foreground/50 placeholder:text-sm placeholder:tracking-normal"
                  />
                  <button type="submit" disabled={joinCode.length !== 4} className="rounded-lg bg-white/10 px-6 font-display font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-50 flex items-center justify-center">
                    JOIN
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {mode === "lobby" && (
            <motion.div key="lobby" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center shadow-[0_0_30px_hsl(42_100%_50%_/_0.1)]">
                <p className="text-sm tracking-widest text-primary mb-2">ROOM CODE</p>
                <h2 className="font-mono text-5xl font-black text-white tracking-[0.3em]">{roomCode}</h2>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <h3 className="mb-4 font-display text-sm text-muted-foreground tracking-widest">RACERS ({players.length}/4)</h3>
                <div className="flex flex-col gap-3">
                  {players.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3 px-4 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                          {i + 1}
                        </div>
                        <span className="font-display font-bold text-white tracking-wide">{p.name} {p.id === socket?.id && "(YOU)"}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-50">
                         <Car size={16} />
                         <span className="text-xs uppercase font-mono">{p.car}</span>
                      </div>
                    </div>
                  ))}
                  
                  {players.length < 4 && (
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-white/20 bg-transparent p-3 opacity-50">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-mono text-xs tracking-widest">WAITING FOR OTHERS...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {countdown !== null ? (
                <div className="text-center py-4">
                  <motion.h1 
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display text-6xl font-black text-primary"
                  >
                    {countdown > 0 ? countdown : "GO!"}
                  </motion.h1>
                </div>
              ) : (
                isHost ? (
                  <button 
                    onClick={handleStartRace} 
                    disabled={players.length < 2}
                    className="w-full rounded-xl bg-primary py-4 font-display text-lg font-bold text-black tracking-widest transition-all hover:bg-primary/90 disabled:opacity-50 disabled:grayscale"
                  >
                    {players.length < 2 ? "WAITING FOR RACERS..." : "START RACE"}
                  </button>
                ) : (
                  <div className="w-full rounded-xl bg-white/5 py-4 text-center border border-white/10">
                    <span className="font-display text-lg font-bold text-muted-foreground tracking-widest">WAITING FOR HOST TO START...</span>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MultiplayerScreen;
