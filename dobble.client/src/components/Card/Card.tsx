/** @jsxImportSource @emotion/react */
import { Card as MUICard, css, styled, keyframes } from "@mui/material";

import { useIconsTransform } from "@/hooks";
import { type Token } from "@/cards";
import { TOKENS_PER_CARD } from "@/constants";
import { getTotalTokensAmount } from "@/utils";

import { createIconTransformComputer } from "./Card.utils";
import { getIconsPack } from "./icons";

const icons = getIconsPack({
  name: "yana",
  amount: getTotalTokensAmount(TOKENS_PER_CARD),
});
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

  return (
    <MUICardStyled $clickable={!!onTokenClick} className={className}>
      <>
        {tokens.map((token, i) => {
          const { Icon } = icons[token];

          return (
            <Icon
              key={token}
              onClick={() => onTokenClick?.(token)}
              onAnimationEnd={answer === token ? onAnswerRevealed : undefined}
              sx={answer === token ? { animation: `${flash} 0.5s` } : {}}
              css={computeIconTransform(i, iconEffects)}
            />
          );
        })}
      </>
    </MUICardStyled>
  );
};

const flash = keyframes`
  50% {
      opacity: 0;
  }

  to {
      opacity: 1;
  }
`;

const MUICardStyled = styled(MUICard, {
  shouldForwardProp: (prop: string) => !["$clickable"].includes(prop),
})<{
  $clickable: boolean;
}>`
  position: relative;
  width: 30dvh;
  height: 30dvh;
  border-radius: 100%;

  > * {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15% !important;
    height: 15% !important;

    ${({ $clickable }) =>
      $clickable &&
      css`
        @media (hover: hover) {
          cursor: pointer;

          &:hover {
            opacity: 0.7;
          }
        }
      `}
  }
`;

export default Card;
