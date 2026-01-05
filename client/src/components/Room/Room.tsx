import { useSocketGame } from "@/hooks";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerPane from "../PlayerPane";
import Card from "../Card";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    status,
    gameState,
    error,
    connect,
    submitAnswer,
    requestHint,
    hint,
    resetGame,
    clearHint,
  } = useSocketGame();

  useEffect(() => {
    if (roomId && status === "disconnected") {
      void connect(roomId);
    }
  }, [roomId, status, connect]);

  const roomUrl = `${window.location.origin}/room/${roomId}`;

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(roomUrl);
  };

  const handleBackToLobby = () => {
    void navigate("/");
  };

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center h-dvh gap-6 p-4">
        <h1 className="text-6xl font-black text-gradient drop-shadow-lg">
          Oops!
        </h1>
        <p className="text-fun-red bg-fun-red/20 px-6 py-3 rounded-full backdrop-blur-sm text-lg">
          {error}
        </p>
        <button
          className="px-8 py-4 bg-gradient-to-r from-fun-red to-fun-orange text-white text-xl font-bold rounded-full shadow-lg shadow-fun-red/40 hover:scale-105 hover:shadow-fun-red/60 transition-all uppercase tracking-wide"
          onClick={handleBackToLobby}
        >
          Back to Lobby
        </button>
      </main>
    );
  }

  if (status === "connecting" || !gameState) {
    return (
      <main className="flex flex-col items-center justify-center h-dvh gap-6">
        <h1 className="text-6xl font-black text-gradient drop-shadow-lg animate-pulse-slow">
          Dobble
        </h1>
        <div className="w-12 h-12 border-4 border-white/30 border-t-fun-orange border-r-fun-red rounded-full animate-spin-fun" />
        <p className="text-white/60">Connecting...</p>
      </main>
    );
  }

  // Waiting for opponent
  if (!gameState.isGameActive) {
    return (
      <main className="flex flex-col items-center justify-center h-dvh gap-6 p-4">
        <h1 className="text-6xl font-black text-gradient drop-shadow-lg">
          Dobble
        </h1>
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
          <p className="text-xl animate-pulse-slow">Waiting for opponent...</p>
          <code className="block text-sm text-white/70 break-all max-w-[300px] text-center select-text bg-black/20 px-4 py-2 rounded-lg">
            {roomUrl}
          </code>
          <button
            className="px-6 py-3 bg-gradient-to-r from-fun-teal to-fun-pink text-fun-purple font-bold rounded-full shadow-lg shadow-fun-teal/40 hover:scale-105 hover:shadow-fun-teal/60 transition-all"
            onClick={handleCopyUrl}
          >
            Copy Link
          </button>
        </div>
      </main>
    );
  }

  const { slots, commonCard, winner, yourSlotId } = gameState;
  const yourSlot = slots.find((s) => s.id === yourSlotId);

  if (!yourSlot) {
    return null;
  }

  if (winner) {
    const isWinner = winner === yourSlotId;
    return (
      <main className="flex flex-col items-center justify-center h-dvh gap-6 p-4">
        <h1
          className={`text-6xl font-black drop-shadow-lg animate-bounce-in ${
            isWinner ? "text-gradient" : "text-white/80"
          }`}
        >
          {isWinner ? "You Won!" : "You Lost!"}
        </h1>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">Your Score</p>
          <p className="text-5xl font-black text-gradient">{yourSlot.score}</p>
        </div>
        <button
          className="px-8 py-4 bg-gradient-to-r from-fun-red to-fun-orange text-white text-xl font-bold rounded-full shadow-lg shadow-fun-red/40 hover:scale-105 hover:shadow-fun-red/60 transition-all uppercase tracking-wide"
          onClick={resetGame}
        >
          Play Again
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-4 h-dvh p-[2dvh] box-border overflow-hidden">
      <Card tokens={commonCard.tokens} />
      <PlayerPane
        slot={yourSlot}
        isYou
        hint={hint}
        onTokenClick={submitAnswer}
        onHintClick={requestHint}
        onHintRevealed={clearHint}
      />
    </main>
  );
}
