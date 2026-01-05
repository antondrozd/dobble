import { Lightbulb } from "lucide-react";

import type { Token, PlayerSlotDto as PlayerSlot } from "@dobble/shared/types";
import Card from "@/components/Card";

type Props = {
  slot: PlayerSlot;
  isYou: boolean;
  hint?: Token | null;
  onTokenClick?: (token: Token) => void;
  onHintClick?: () => void;
  onHintRevealed?: () => void;
  className?: string;
};

const PlayerPane = ({
  slot,
  isYou,
  hint,
  onTokenClick,
  onHintClick,
  onHintRevealed,
  className,
}: Props) => {
  const { card, score } = slot;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-center ${
        className ?? ""
      }`}
    >
      <Card
        tokens={card.tokens}
        onTokenClick={isYou ? onTokenClick : undefined}
        answer={hint ?? undefined}
        onAnswerRevealed={onHintRevealed ?? (() => {})}
      />
      <div className="flex sm:flex-col flex-row items-center justify-around gap-3 sm:gap-4">
        <div className="glass rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-center">
          <p className="text-xs sm:text-sm text-white/70 uppercase tracking-wider">
            Score
          </p>
          <p className="text-2xl sm:text-4xl font-black text-gradient">
            {score}
          </p>
        </div>
        {isYou && (
          <button
            onClick={onHintClick}
            className="p-2 sm:p-3 rounded-full bg-linear-to-br from-fun-orange to-fun-red shadow-lg shadow-fun-orange/30 hover:scale-110 hover:shadow-fun-orange/50 active:scale-90 active:shadow-sm transition-all"
          >
            <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerPane;
