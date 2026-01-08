import { createRoom } from "@/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGame = async () => {
    setIsCreating(true);
    try {
      const roomId = await createRoom();
      void navigate(`/room/${roomId}`);
    } catch {
      setIsCreating(false);
    }
  };

  const handleJoinGame = () => {
    if (joinRoomId) {
      void navigate(`/room/${joinRoomId}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-dvh gap-6 p-4">
      <h1 className="text-7xl font-black text-gradient drop-shadow-lg animate-bounce-in">
        Dobble
      </h1>

      {isCreating ? (
        <div className="w-12 h-12 border-4 border-white/30 border-t-primary-soft border-r-primary rounded-full animate-spin-fun" />
      ) : (
        <div className="flex flex-col items-center gap-6 animate-bounce-in">
          <button
            className="px-8 py-4 bg-linear-to-r from-primary to-primary-soft text-white text-xl font-bold rounded-full shadow-lg shadow-primary/40 hover:scale-105 hover:shadow-primary/60 active:scale-95 active:shadow-sm transition-all uppercase tracking-wide"
            onClick={() => void handleCreateGame()}
          >
            Create Game
          </button>

          <span className="text-white/60 text-lg">or join a friend</span>

          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value.trim())}
              className="px-5 py-3 border-2 border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 outline-none focus:border-primary-soft focus:shadow-lg focus:shadow-primary-soft/30 transition-all"
            />
            <button
              className="px-6 py-3 bg-linear-to-r from-secondary to-secondary-soft text-accent font-bold rounded-full shadow-lg shadow-secondary/40 hover:scale-105 hover:shadow-secondary/60 active:scale-95 active:shadow-sm transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              onClick={handleJoinGame}
              disabled={!joinRoomId}
            >
              Join
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
