import { Chip, styled } from "@mui/material";
import { EmojiObjectsTwoTone } from "@mui/icons-material";

import type { Token, PlayerSlotDto as PlayerSlot } from "@dobble/shared";
import Card from "@/components/Card";
import { getRandomRotation } from "@/utils";

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
    <Wrapper className={className}>
      <RotatedCard
        tokens={card.tokens}
        onTokenClick={isYou ? onTokenClick : undefined}
        answer={hint ?? undefined}
        onAnswerRevealed={onHintRevealed ?? (() => {})}
      />
      <Controls>
        <Chip label={`Score: ${score}`} color="success" sx={{ mt: 2 }} />
        {isYou && <HintIcon onClick={onHintClick} />}
      </Controls>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const RotatedCard = styled(Card)`
  transform: rotate(${getRandomRotation()});
`;

const Controls = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const HintIcon = styled(EmojiObjectsTwoTone)`
  font-size: 3rem;
  color: #ffea00;

  @media (hover: hover) {
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export default PlayerPane;
