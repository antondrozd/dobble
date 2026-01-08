import { Lightbulb } from "lucide-react";

import type { Token, Card as CardType } from "@dobble/shared/types";
import Card from "@/components/Card";

type Props = {
  card: CardType;
  hint?: Token;
  onTokenClick?: (token: Token) => void;
  onSkipClick?: () => void;
  onHintRevealed?: () => void;
};

const PlayerPane = ({
  card,
  hint,
  onTokenClick,
  onSkipClick,
  onHintRevealed,
}: Props) => {
  return (
    <div className="sm:flex sm:flex-row sm:gap-4 sm:items-center">
      <Card
        tokens={card.tokens}
        onTokenClick={onTokenClick}
        hint={hint}
        onHintRevealed={onHintRevealed}
      />
      <button
        onClick={onSkipClick}
        className="absolute bottom-4 left-4 sm:static flex items-center gap-1 p-2 sm:p-3 rounded-full bg-linear-to-br from-primary-soft to-primary shadow-lg shadow-primary-soft/30 hover:scale-110 hover:shadow-primary-soft/50 active:scale-90 active:shadow-sm transition-all"
      >
        Skip <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </button>
    </div>
  );
};

export default PlayerPane;
