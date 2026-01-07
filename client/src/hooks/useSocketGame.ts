import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useCallback,
} from "react";

import type { Token, GameStateDto as GameState } from "@dobble/shared/types";
import { createSocket, type GameSocket } from "@/services/socket";
import { useSeed } from "./useSeed";
import { usePlayerName } from "./usePlayerName";
import { createRoom } from "@/api";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export const useSocketGame = () => {
  const socketRef = useRef<GameSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [pendingState, setPendingState] = useState<GameState | null>(null);
  const [hint, setHint] = useState<Token>();
  const [isSkipping, setIsSkipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSeed = useSeed((state) => state.setSeed);
  const name = usePlayerName((state) => state.name);

  const handleGameState = useEffectEvent((state: GameState) => {
    setSeed(state.seed);

    if (isSkipping) {
      setPendingState(state);
      return;
    }

    setGameState((prev) => {
      const prevSlot = prev?.slots.find((s) => s.id === prev.yourSlotId);
      const newSlot = state.slots.find((s) => s.id === state.yourSlotId);

      if (prevSlot?.card.id !== newSlot?.card.id) {
        setHint(undefined);
      }

      return state;
    });
  });

  const handleGameSkip = useEffectEvent(({ token }: { token: Token }) => {
    setHint(token);
    setIsSkipping(true);
  });

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("game:state", handleGameState);
    socket.on("game:skip", handleGameSkip);

    socket.on("game:full", () => {
      setError("Room is full");
    });

    socket.on("room:not-found", () => {
      setError("Room not found");
    });

    socket.on("room:closed", () => {
      setError("Room was closed due to inactivity");
      setGameState(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const connect = useCallback(
    async (existingRoomId?: string): Promise<string | null> => {
      setStatus("connecting");
      setError(null);

      try {
        const id = existingRoomId ?? (await createRoom());
        setRoomId(id);

        const socket = socketRef.current;
        if (!socket) return null;

        if (socket.connected) {
          socket.emit("game:join", { roomId: id, name });
          setStatus("connected");
        } else {
          socket.once("connect", () => {
            socket.emit("game:join", { roomId: id, name });
            setStatus("connected");
          });
          socket.connect();
        }

        return id;
      } catch {
        setStatus("error");
        setError("Failed to connect");
        return null;
      }
    },
    [name]
  );

  const submitAnswer = useCallback((token: Token) => {
    socketRef.current?.emit("game:answer", { token });
  }, []);

  const requestSkip = useCallback(() => {
    socketRef.current?.emit("game:skip");
  }, []);

  const resetGame = useCallback(() => {
    socketRef.current?.emit("game:reset");
  }, []);

  const handleSkipAnimationComplete = useCallback(() => {
    setGameState(pendingState);
    setPendingState(null);
    setHint(undefined);
    setIsSkipping(false);
  }, [pendingState]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    setRoomId(null);
    setGameState(null);
    setStatus("disconnected");
  }, []);

  return {
    status,
    roomId,
    gameState,
    hint,
    error,
    connect,
    disconnect,
    submitAnswer,
    requestSkip,
    resetGame,
    handleSkipAnimationComplete,
  };
};
