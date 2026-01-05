import { useSocketGame, usePlayerName } from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

export default function Lobby() {
  const navigate = useNavigate();
  const { status, error, connect } = useSocketGame();
  const { name, setName, regenerateName } = usePlayerName();
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateGame = () => {
    void connect().then((roomId) => {
      if (roomId) {
        void navigate(`/room/${roomId}`);
      }
    });
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

      {error && (
        <p className="text-fun-red bg-fun-red/20 px-4 py-2 rounded-full backdrop-blur-sm">
          {error}
        </p>
      )}
      {status === "connecting" && (
        <div className="w-12 h-12 border-4 border-white/30 border-t-fun-orange border-r-fun-red rounded-full animate-spin-fun" />
      )}
      {status === "disconnected" && (
        <div className="flex flex-col items-center gap-6 animate-bounce-in">
          <div className="flex items-center border-2 border-white/30 rounded-full bg-white/10 backdrop-blur-sm focus-within:border-fun-purple focus-within:shadow-lg focus-within:shadow-fun-purple/30 transition-all">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-5 py-3 bg-transparent text-white placeholder-white/60 outline-none text-center text-lg font-medium"
            />
            <button
              className="p-3 hover:bg-white/10 rounded-full transition-all"
              onClick={regenerateName}
              title="Generate new name"
            >
              <RefreshCw className="w-5 h-5 text-white/70 hover:text-white" />
            </button>
          </div>

          <button
            className="px-8 py-4 bg-linear-to-r from-fun-red to-fun-orange text-white text-xl font-bold rounded-full shadow-lg shadow-fun-red/40 hover:scale-105 hover:shadow-fun-red/60 active:scale-95 active:shadow-sm transition-all uppercase tracking-wide disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            onClick={handleCreateGame}
            disabled={!name.trim()}
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
              className="px-5 py-3 border-2 border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 outline-none focus:border-fun-orange focus:shadow-lg focus:shadow-fun-orange/30 transition-all"
            />
            <button
              className="px-6 py-3 bg-linear-to-r from-fun-teal to-fun-pink text-fun-purple font-bold rounded-full shadow-lg shadow-fun-teal/40 hover:scale-105 hover:shadow-fun-teal/60 active:scale-95 active:shadow-sm transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
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
