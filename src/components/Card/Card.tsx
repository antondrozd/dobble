import random from "random";
import { Card as MUICard, css, styled, keyframes } from "@mui/material";

import icons from "./icons";
import { useIconsEffects } from "../../useIconsEffects";
import { cards } from "../../cards";

const iconsPackShift = random.int(0, icons.length - cards.length - 1);

type BaseProps = {
  tokens: number[];
  size?: string;
  onTokenClick?: (token: number) => void;
  className?: string;
};

type HintProps =
  | { answer?: never; onAnswerRevealed?: never }
  | {
      answer?: number;
      onAnswerRevealed: () => void;
    };

type Props = BaseProps & HintProps;

const Card = ({
  tokens,
  size = "300px",
  onTokenClick,
  answer,
  onAnswerRevealed,
  className,
}: Props) => {
  const { rotations, scales } = useIconsEffects(tokens);

  return (
    <MUICardStyled
      $size={size}
      $clickable={!!onTokenClick}
      $rotations={rotations}
      $scales={scales}
      className={className}
    >
      <>
        {tokens.map((token) => {
          const Icon = icons[token + iconsPackShift];

          return (
            <Icon
              key={token}
              onClick={() => onTokenClick?.(token)}
              onAnimationEnd={answer === token ? onAnswerRevealed : undefined}
              sx={answer === token ? { animation: `${flash} 0.5s` } : {}}
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
  shouldForwardProp: (prop: string) =>
    !["$size", "$clickable", "$rotations", "$scales"].includes(prop),
})<{
  $size: string;
  $clickable: boolean;
  $rotations: string[];
  $scales: number[];
}>`
  position: relative;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 100%;

  > * {
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${({ $size }) => `calc(${$size} / 7)`} !important;
    height: ${({ $size }) => `calc(${$size} / 7)`} !important;
    transform: ${({ $rotations, $scales }) =>
      `translate(-50%, -50%) scale(${$scales[0]}) rotate(${$rotations[0]})`};

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

    &:nth-of-type(2) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(0deg) translate(calc(${$size} / 3)) rotate(0deg)
        scale(${$scales[1]}) rotate(${$rotations[1]})`};
    }
    &:nth-of-type(3) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(51.4deg) translate(calc(${$size} / 3)) rotate(-51.4deg)
        scale(${$scales[2]}) rotate(${$rotations[2]})`};
    }
    &:nth-of-type(4) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(102.8deg) translate(calc(${$size} / 3)) rotate(-102.8deg)
        scale(${$scales[3]}) rotate(${$rotations[3]})`};
    }
    &:nth-of-type(5) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(154.2deg) translate(calc(${$size} / 3)) rotate(-154.2deg)
        scale(${$scales[4]}) rotate(${$rotations[4]})`};
    }
    &:nth-of-type(6) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(205.6deg) translate(calc(${$size} / 3)) rotate(-205.6deg)
        scale(${$scales[5]}) rotate(${$rotations[5]})`};
    }
    &:nth-of-type(7) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(257deg) translate(calc(${$size} / 3)) rotate(-257deg)
        scale(${$scales[6]}) rotate(${$rotations[6]})`};
    }
    &:nth-of-type(8) {
      transform: ${({
        $size,
        $rotations,
        $scales,
      }) => `translate(-50%, -50%) rotate(308.4deg) translate(calc(${$size} / 3)) rotate(-308.4deg)
        scale(${$scales[7]}) rotate(${$rotations[7]})`};
    }
  }
`;

export default Card;
