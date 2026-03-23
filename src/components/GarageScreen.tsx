import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Car, PaintBucket, Wrench, Trophy, Check, Lock, Star } from "lucide-react";
import { getUserStats, syncWithServer, getUserId } from "@/lib/userStore";
import { SERVER_URL } from "@/lib/api";

interface GarageScreenProps {
  onBack: () => void;
}

const CAR_ITEMS = [
  { id: "standard", name: "Standard Issue", type: "Chassis", cost: 0, rarity: "Common" },
  { id: "neon_byte", name: "Neon Byte", type: "Chassis", cost: 500, rarity: "Rare" },
  { id: "hacker_green", name: "Hacker Green", type: "Paint", cost: 800, rarity: "Epic" },
  { id: "cyber_void", name: "Cyber Void Chassis", type: "Chassis", cost: 2000, rarity: "Legendary" },
  { id: "gold_trim", name: "Gold Trim (Rank 10)", type: "Paint", cost: 5000, rarity: "Mythic" },
];

const getRarityColor = (rarity: string) => {
  if (rarity === "Common") return "text-muted-foreground";
  if (rarity === "Rare") return "text-blue-400";
  if (rarity === "Epic") return "text-purple-400";
  if (rarity === "Legendary") return "text-primary";
  if (rarity === "Mythic") return "text-luxury-rose-gold text-glow-gold";
  return "text-muted-foreground";
};

const GarageScreen = ({ onBack }: GarageScreenProps) => {
  const [stats, setStats] = useState(() => getUserStats());
  const [inventory, setInventory] = useState<{ equippedCar: string; ownedCars: string[] }>({ equippedCar: "standard", ownedCars: ["standard"] });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    Promise.all([
      syncWithServer().then(s => setStats(s)),
      fetch(`${SERVER_URL}/api/inventory?userId=${userId}`).then(r => r.json()).then(data => setInventory(data))
    ]).finally(() => setLoading(false));
  }, []);

  const handleBuy = async (itemId: string, cost: number) => {
    if (stats.coins < cost || purchasing) return;
    const userId = getUserId();
    if (!userId) return;

    setPurchasing(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/shop/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId, cost })
      });
      const data = await res.json();
      if (data.status === "Success") {
        setInventory(prev => ({ ...prev, ownedCars: data.ownedCars }));
        setStats(prev => ({ ...prev, coins: data.newBalance }));
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleEquip = async (itemId: string) => {
    if (!inventory.ownedCars.includes(itemId) || purchasing) return;
    const userId = getUserId();
    if (!userId) return;

    setPurchasing(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/shop/equip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId })
      });
      const data = await res.json();
      if (data.status === "Success") {
        setInventory(prev => ({ ...prev, equippedCar: data.equippedCar }));
      }
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(42 80% 6% / 0.3), transparent 40%), hsl(240 20% 3%)" }}
    >
      <div className="relative z-10 flex flex-1 flex-col p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={20} /></button>
            <Wrench size={18} className="text-primary" />
            <h1 className="font-display text-xl font-bold tracking-[0.15em]" style={{ background: "linear-gradient(135deg, hsl(42 100% 65%), hsl(42 100% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Garage</h1>
          </div>
          
          <div className="flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: "hsl(42 100% 55% / 0.1)", border: "1px solid hsl(42 100% 55% / 0.2)" }}>
            <Trophy size={14} className="text-primary" />
            <span className="font-display text-lg font-bold text-primary">{stats.coins.toLocaleString()}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Wrench size={24} className="text-primary opacity-50" />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAR_ITEMS.map((item, i) => {
              const isOwned = inventory.ownedCars.includes(item.id);
              const isEquipped = inventory.equippedCar === item.id;
              const canAfford = stats.coins >= item.cost;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col rounded-xl p-4 transition-all"
                  style={{ 
                    background: isEquipped ? "hsl(42 100% 55% / 0.08)" : "hsl(240 15% 7% / 0.8)",
                    border: `1px solid ${isEquipped ? "hsl(42 100% 55% / 0.3)" : "hsl(240 15% 15%)"}`,
                    boxShadow: isEquipped ? "0 0 20px hsl(42 100% 55% / 0.1)" : "none"
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.type === "Chassis" ? <Car size={16} className={getRarityColor(item.rarity)} /> : <PaintBucket size={16} className={getRarityColor(item.rarity)} />}
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">{item.type}</span>
                    </div>
                    <span className={`font-mono text-[10px] font-bold ${getRarityColor(item.rarity)} uppercase tracking-wider`}>
                      {item.rarity}
                    </span>
                  </div>

                  <h3 className="mb-1 font-display text-lg font-bold text-foreground">{item.name}</h3>
                  <div className="mb-4 flex-1">
                    {!isOwned && (
                      <div className="flex items-center gap-1.5 font-mono text-sm">
                        <Trophy size={12} className={canAfford ? "text-primary" : "text-destructive"} />
                        <span className={canAfford ? "text-primary" : "text-destructive"}>{item.cost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {isEquipped ? (
                    <button disabled className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-display text-xs font-bold transition-all" style={{ background: "hsl(42 100% 55% / 0.2)", color: "hsl(42 100% 55%)" }}>
                      <Check size={14} /> EQUIPPED
                    </button>
                  ) : isOwned ? (
                    <button onClick={() => handleEquip(item.id)} disabled={purchasing} className="w-full rounded-xl py-2.5 font-display text-xs font-bold hover:bg-white/10 transition-all text-white" style={{ background: "hsl(240 15% 15%)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                      EQUIP
                    </button>
                  ) : (
                    <button onClick={() => handleBuy(item.id, item.cost)} disabled={!canAfford || purchasing} className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-display text-xs font-bold transition-all disabled:opacity-50" style={{ background: canAfford ? "linear-gradient(135deg, hsl(42 100% 55%), hsl(42 80% 45%))" : "hsl(240 15% 15%)", color: canAfford ? "hsl(240 20% 3%)" : "hsl(240 10% 40%)" }}>
                      {!canAfford && <Lock size={12} />} BUY
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GarageScreen;
