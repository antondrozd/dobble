import { useMemo } from "react";

import { type Token, TOKENS_PER_CARD } from "@dobble/shared";
import { useIconsTransform, useSeed } from "@/hooks";
import { getRandomRotation, getTotalTokensAmount } from "@/utils";

import { createIconTransformComputer } from "./Card.utils";
import { getIconsPack } from "./icons";

const computeIconTransform = createIconTransformComputer(TOKENS_PER_CARD);

type BaseProps = {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
};

type HintProps =
  | { answer?: never; onAnswerRevealed?: never }
  | {
      answer?: Token;
      onAnswerRevealed: () => void;
    };

type Props = BaseProps & HintProps;

const Card = ({
  tokens,
  onTokenClick,
  answer,
  onAnswerRevealed,
  className,
}: Props) => {
  const iconEffects = useIconsTransform(tokens);
  const seed = useSeed((state) => state.seed);
  const icons = useMemo(
    () =>
      getIconsPack({
        name: "dogs",
        amount: getTotalTokensAmount(TOKENS_PER_CARD),
        seed,
      }),
    [seed]
  );
  const rotation = useMemo(() => getRandomRotation(), []);

  const isClickable = !!onTokenClick;

  return (
    <div
      className={`relative aspect-square w-[clamp(200px,42dvh,min(85vw,450px))] rounded-full bg-linear-to-br from-white to-gray-100 shadow-[0_0_60px_rgba(255,255,255,0.4),0_0_100px_rgba(254,202,87,0.2)] border-4 border-white/50 shrink-0 ${className ?? ""}`}
      style={{ transform: `rotate(${rotation})` }}
    >
      {tokens.map((token, i) => {
        const { Icon } = icons[token];
        const transformStyle = computeIconTransform(i, iconEffects);

        return (
          <div
            key={token}
            onClick={() => onTokenClick?.(token)}
            onAnimationEnd={answer === token ? onAnswerRevealed : undefined}
            className={`absolute top-1/2 left-1/2 w-[15%] h-[15%] ${answer === token ? "animate-flash" : ""}`}
            style={transformStyle}
          >
            <Icon
              className={`w-full h-full transition-transform ${isClickable ? "cursor-pointer hover:scale-110 active:scale-90" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Card;
