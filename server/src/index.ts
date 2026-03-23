import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
  },
  pingInterval: 25000,
  pingTimeout: 60000,
  transports: ["websocket", "polling"]
});

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper function to get the actual user
async function getUser(id: string) {
  if (!id) return null;
  return await prisma.user.findUnique({ where: { id } });
}

// API: Authentication
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ status: "Error", message: "Username already taken" });
    }
    const user = await prisma.user.create({
      data: { username, level: 1, score: 0, coins: 0, rewardPoints: 0 },
    });
    res.json({ status: "Success", user });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  // Note: Password checking is omitted for simplicity in this prototype
  const user = await prisma.user.findUnique({ where: { username } });
  if (user) {
    res.json({ status: "Success", user });
  } else {
    res.status(401).json({ status: "Error", message: "User not found" });
  }
});

// API: Pulse Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ORBITAI Core Operating", system: "Code Racer 3D - Racing Sync" });
});

// API: Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  const sorted = await prisma.user.findMany({
    orderBy: { score: "desc" },
    take: 50
  });
  
  // Map Prisma field (rewardPoints) to frontend expectation (points)
  const mapped = sorted.map(u => ({ ...u, points: u.rewardPoints, name: u.username }));
  res.json(mapped);
});

// API: Current user stats
app.get("/api/stats", async (req, res) => {
  const userId = req.query.userId as string;
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ ...user, name: user.username, points: user.rewardPoints });
});

// API: Update stats/rewards
app.post("/api/reward", async (req, res) => {
  const { userId, coins, points, exp } = req.body;
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const additionalLevel = exp ? Math.floor(exp / 500) : 0;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      coins: { increment: coins || 0 },
      rewardPoints: { increment: points || 0 },
      score: { increment: (coins || 0) * 10 },
      level: { increment: additionalLevel },
    }
  });
  
  res.json({ status: "Success", stats: { ...updatedUser, name: updatedUser.username, points: updatedUser.rewardPoints } });
});

// API: Garage / Inventory Sync
app.get("/api/inventory", async (req, res) => {
  const userId = req.query.userId as string;
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    equippedCar: user.equippedCar,
    ownedCars: JSON.parse(user.ownedCars)
  });
});

app.post("/api/shop/buy", async (req, res) => {
  const { userId, itemId, cost } = req.body;
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  if (user.coins >= cost) {
    const owned = JSON.parse(user.ownedCars);
    if (!owned.includes(itemId)) {
      owned.push(itemId);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          coins: { decrement: cost },
          ownedCars: JSON.stringify(owned)
        }
      });
      res.json({ status: "Success", newBalance: user.coins - cost, ownedCars: owned });
    } else {
      res.status(400).json({ status: "Error", message: "Item already owned" });
    }
  } else {
    res.status(400).json({ status: "Error", message: "Insufficient coins" });
  }
});

app.post("/api/shop/equip", async (req, res) => {
  const { userId, itemId } = req.body;
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const owned = JSON.parse(user.ownedCars);
  
  if (owned.includes(itemId)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { equippedCar: itemId }
    });
    res.json({ status: "Success", equippedCar: itemId });
  } else {
    res.status(400).json({ status: "Error", message: "Cannot equip unowned item" });
  }
});

// ORBITAI Neural Link Knowledge Base
const aiKnowledge: Record<string, string> = {
  race: "🏁 Focus on accuracy! Each correct answer gives a nitro boost. Practice daily challenges for XP.",
  customize: "🔧 Head to the Garage! Change paint, add patterns, upgrade performance with coins.",
  python: "🐍 Start with Variables at Beginner level. Pro tip: solve without hints for 2x XP!",
  reward: "🏆 Earn XP and coins every race. Hit Top 10 for exclusive skins!",
  async: "⚡ Async/await allows non-blocking execution. Perfect for high-speed server fetches!",
  default: "👋 I'm your AI Co-Pilot!\n• 🏎️ Racing strategies\n• 🔧 Customization tips\n• 📚 Coding tutorials\n• 🏆 Progression help\n\nAsk me anything!",
};

// API: ORBITAI Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  const { message } = req.body;
  const lower = (message || "").toLowerCase();
  
  // Simulated AI Processing Delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  let response = aiKnowledge.default;
  if (lower.includes("race") || lower.includes("win") || lower.includes("tip")) response = aiKnowledge.race;
  else if (lower.includes("custom") || lower.includes("garage") || lower.includes("car")) response = aiKnowledge.customize;
  else if (lower.includes("python") || lower.includes("learn")) response = aiKnowledge.python;
  else if (lower.includes("reward") || lower.includes("unlock") || lower.includes("coin")) response = aiKnowledge.reward;
  else if (lower.includes("async") || lower.includes("await")) response = aiKnowledge.async;

  res.json({ response });
});

// Socket.io: Room-Based Real-time Racing Loop
const lobbies: Record<string, { host: string, players: { id: string, name: string, car: string, ready: boolean }[], status: "waiting" | "racing" }> = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on("connection", (socket) => {
  console.log("🏎️ Racer Connected:", socket.id);

  socket.on("create-lobby", async (data) => {
    const { username, equippedCar } = data;
    const roomCode = generateRoomCode();
    
    lobbies[roomCode] = {
      host: socket.id,
      players: [{ id: socket.id, name: username, car: equippedCar, ready: false }],
      status: "waiting"
    };
    
    socket.join(roomCode);
    socket.emit("lobby-created", { roomCode, host: socket.id, players: lobbies[roomCode].players });
    console.log(`[LOBBY] ${username} created ${roomCode}`);
  });

  socket.on("join-lobby", async (data) => {
    const { roomCode, username, equippedCar } = data;
    const room = roomCode.toUpperCase();
    
    if (lobbies[room] && lobbies[room].status === "waiting") {
      if (lobbies[room].players.length >= 4) {
        socket.emit("lobby-error", "Room is full (Max 4)");
        return;
      }
      
      lobbies[room].players.push({ id: socket.id, name: username, car: equippedCar, ready: false });
      socket.join(room);
      
      // Update everyone in the room
      io.to(room).emit("lobby-updated", lobbies[room]);
      console.log(`[LOBBY] ${username} joined ${room}`);
    } else {
      socket.emit("lobby-error", "Room not found or already racing");
    }
  });

  socket.on("start-race-countdown", (room) => {
    if (lobbies[room] && lobbies[room].host === socket.id && lobbies[room].players.length > 1) {
      lobbies[room].status = "racing";
      io.to(room).emit("race-countdown", 5); // 5 seconds
      
      let countdown = 4;
      const interval = setInterval(() => {
        if (countdown > 0) {
          io.to(room).emit("race-countdown", countdown);
          countdown--;
        } else {
          io.to(room).emit("race-start");
          clearInterval(interval);
        }
      }, 1000);
    }
  });

  socket.on("join-room", (room: string) => {
    // Legacy support for single player tutorial / AI sync
    socket.join(room);
  });

  socket.on("sync-position", (data) => {
    const { room, position } = data;
    socket.to(room).emit("player-position-update", { id: socket.id, position });
  });

  socket.on("nitro-boost", (data) => {
    const { room, strength } = data;
    socket.to(room).emit("player-boosted", { id: socket.id, strength });
  });

  socket.on("disconnect", () => {
    console.log("🏁 Racer Disconnected:", socket.id);
    
    // Cleanup lobbies if host disconnected or player left
    for (const [roomCode, lobby] of Object.entries(lobbies)) {
      const pIndex = lobby.players.findIndex(p => p.id === socket.id);
      if (pIndex !== -1) {
        lobby.players.splice(pIndex, 1);
        if (lobby.players.length === 0) {
          delete lobbies[roomCode];
        } else if (lobby.host === socket.id) {
          // Reassign host
          lobby.host = lobby.players[0].id;
          io.to(roomCode).emit("lobby-updated", lobby);
        } else {
          io.to(roomCode).emit("lobby-updated", lobby);
        }
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Code Racer Server active on port ${PORT}`);
  console.log(`💡 Connect: http://localhost:${PORT}/api/health`);
});
