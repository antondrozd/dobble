import { useSocketGame } from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const navigate = useNavigate();
  const { status, error, connect } = useSocketGame();
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
          <button
            className="px-8 py-4 bg-gradient-to-r from-fun-red to-fun-orange text-white text-xl font-bold rounded-full shadow-lg shadow-fun-red/40 hover:scale-105 hover:shadow-fun-red/60 transition-all uppercase tracking-wide"
            onClick={handleCreateGame}
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
              className="px-6 py-3 bg-gradient-to-r from-fun-teal to-fun-pink text-fun-purple font-bold rounded-full shadow-lg shadow-fun-teal/40 hover:scale-105 hover:shadow-fun-teal/60 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
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
