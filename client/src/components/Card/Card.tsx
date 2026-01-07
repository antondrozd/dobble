import { useMemo } from "react";

import type { Token } from "@dobble/shared/types";
import { TOKENS_PER_CARD } from "@dobble/shared/constants";
import { useIconsTransform, useSeed } from "@/hooks";
import { cn } from "@/utils/cn";
import { getRandomRotation, getTotalTokensAmount } from "@/utils";

import { createIconTransformComputer } from "./Card.utils";
import { getIconsPack } from "./icons";

const computeIconTransform = createIconTransformComputer(TOKENS_PER_CARD);

type BaseProps = {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
};

type HintProps = {
  hint?: Token;
  onHintRevealed?: () => void;
};

type Props = BaseProps & HintProps;

const Card = ({
  tokens,
  onTokenClick,
  hint,
  onHintRevealed,
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
      className={cn("relative card-base shadow-[0_0_60px_rgba(255,255,255,0.4),0_0_100px_rgba(254,202,87,0.2)]", className)}
      style={{ transform: `rotate(${rotation})` }}
    >
      {tokens.map((token, i) => {
        const { Icon } = icons[token];
        const transformStyle = computeIconTransform(i, iconEffects);

        return (
          <div
            key={token}
            onClick={() => onTokenClick?.(token)}
            onAnimationEnd={hint === token ? onHintRevealed : undefined}
            className={cn("absolute top-1/2 left-1/2 w-[15%] h-[15%]", hint === token && "animate-flash")}
            style={transformStyle}
          >
            <Icon
              className={cn("w-full h-full transition-transform", isClickable && "cursor-pointer hover:scale-110 active:scale-90")}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Card;
