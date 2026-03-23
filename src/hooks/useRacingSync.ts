import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "@/lib/api";

export const useRacingSync = (room: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Record<string, number>>({});
  const [isConnected, setIsConnected] = useState(false);
  const currentRoom = useRef(room);

  // Keep ref updated to avoid stale closures in effects
  useEffect(() => {
    currentRoom.current = room;
  }, [room]);

  useEffect(() => {
    if (!room) return;

    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`🏎️ Racing Core Connected: ${newSocket.id} in ${room}`);
      setIsConnected(true);
      newSocket.emit("join-room", room);
    });

    newSocket.on("player-position-update", (data) => {
      setOtherPlayers((prev) => ({ ...prev, [data.id]: data.position }));
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  const syncMyPosition = useCallback((pos: number) => {
    if (socket && isConnected) {
      socket.emit("sync-position", { room: currentRoom.current, position: pos });
    }
  }, [socket, isConnected]);

  const sendNitroBoost = useCallback((strength: number) => {
    if (socket && isConnected) {
      socket.emit("nitro-boost", { room: currentRoom.current, strength });
    }
  }, [socket, isConnected]);

  return { otherPlayers, isConnected, syncMyPosition, sendNitroBoost };
};
