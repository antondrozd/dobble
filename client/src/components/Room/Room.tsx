import { useSocketGame, usePlayerName } from "@/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";
import PlayerPane from "../PlayerPane";
import OpponentCard from "../OpponentCard";
import Card from "../Card";
import ScoreBox from "../ScoreBox";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { name, setName, regenerateName } = usePlayerName();
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

  const handleJoin = () => {
    if (roomId && name.trim()) {
      void connect(roomId);
    }
  };

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
          className="px-8 py-4 bg-linear-to-r from-fun-red to-fun-orange text-white text-xl font-bold rounded-full shadow-lg shadow-fun-red/40 hover:scale-105 hover:shadow-fun-red/60 active:scale-95 active:shadow-sm transition-all uppercase tracking-wide"
          onClick={handleBackToLobby}
        >
          Back to Lobby
        </button>
      </main>
    );
  }

  if (status === "disconnected") {
    return (
      <main className="flex flex-col items-center justify-center h-dvh gap-6 p-4">
        <h1 className="text-6xl font-black text-gradient drop-shadow-lg animate-bounce-in">
          Dobble
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/70">Enter name</p>
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
            className="px-8 py-4 bg-linear-to-r from-fun-teal to-fun-pink text-fun-purple text-xl font-bold rounded-full shadow-lg shadow-fun-teal/40 hover:scale-105 hover:shadow-fun-teal/60 active:scale-95 active:shadow-sm transition-all uppercase tracking-wide disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            onClick={handleJoin}
            disabled={!name.trim()}
          >
            Join Game
          </button>
        </div>
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
          <code className="block text-sm text-white/70 break-all max-w-75 text-center select-text bg-black/20 px-4 py-2 rounded-lg">
            {roomUrl}
          </code>
          <button
            className="px-6 py-3 bg-linear-to-r from-fun-teal to-fun-pink text-fun-purple font-bold rounded-full shadow-lg shadow-fun-teal/40 hover:scale-105 hover:shadow-fun-teal/60 active:scale-95 active:shadow-sm transition-all"
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
  const opponentSlot = slots.find((s) => s.id !== yourSlotId);

  if (!yourSlot) {
    return null;
  }

  if (winner) {
    const isWinner = winner === yourSlotId;
    const sortedSlots = [...slots].sort((a, b) => b.score - a.score);
    return (
      <main className="flex flex-col items-center justify-center h-dvh gap-6 p-4">
        <h1
          className={cn(
            "text-6xl font-black drop-shadow-lg animate-bounce-in",
            isWinner ? "text-gradient" : "text-white/80"
          )}
        >
          {isWinner ? "You Won!" : "You Lost!"}
        </h1>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-xl mb-4 text-white/70">Final Scores</p>
          <div className="flex flex-col gap-3">
            {sortedSlots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "flex justify-between items-center gap-8",
                  slot.id === yourSlotId
                    ? "text-gradient font-bold"
                    : "text-white/80"
                )}
              >
                <span className="text-xl">{slot.name}</span>
                <span className="text-3xl font-black">{slot.score}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="px-8 py-4 bg-linear-to-r from-fun-red to-fun-orange text-white text-xl font-bold rounded-full shadow-lg shadow-fun-red/40 hover:scale-105 hover:shadow-fun-red/60 active:scale-95 active:shadow-sm transition-all uppercase tracking-wide"
          onClick={resetGame}
        >
          Play Again
        </button>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-center gap-4 h-dvh p-[2dvh] box-border overflow-hidden">
      {opponentSlot && (
        <ScoreBox
          name={opponentSlot.name}
          score={opponentSlot.score}
          className="absolute top-4 left-4"
        />
      )}
      <OpponentCard />
      <Card tokens={commonCard.tokens} />
      <PlayerPane
        card={yourSlot.card}
        hint={hint}
        onTokenClick={submitAnswer}
        onHintClick={requestHint}
        onHintRevealed={clearHint}
      />
      <ScoreBox
        name={yourSlot.name}
        score={yourSlot.score}
        className="absolute bottom-4 right-4"
      />
    </main>
  );
}
