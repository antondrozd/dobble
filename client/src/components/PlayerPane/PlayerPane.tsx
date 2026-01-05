import { Lightbulb } from "lucide-react";

import type { Token, Card as CardType } from "@dobble/shared/types";
import Card from "@/components/Card";

type Props = {
  card: CardType;
  hint?: Token | null;
  onTokenClick?: (token: Token) => void;
  onHintClick?: () => void;
  onHintRevealed?: () => void;
};

const PlayerPane = ({
  card,
  hint,
  onTokenClick,
  onHintClick,
  onHintRevealed,
}: Props) => {
  return (
    <div className="sm:flex sm:flex-row sm:gap-4 sm:items-center">
      <Card
        tokens={card.tokens}
        onTokenClick={onTokenClick}
        answer={hint ?? undefined}
        onAnswerRevealed={onHintRevealed ?? (() => {})}
      />
      <button
        onClick={onHintClick}
        className="absolute bottom-4 left-4 sm:static flex items-center gap-1 p-2 sm:p-3 rounded-full bg-linear-to-br from-fun-orange to-fun-red shadow-lg shadow-fun-orange/30 hover:scale-110 hover:shadow-fun-orange/50 active:scale-90 active:shadow-sm transition-all"
      >
        Skip <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </button>
    </div>
  );
};

export default PlayerPane;
