import { Chip, styled } from "@mui/material";
import { EmojiObjectsTwoTone } from "@mui/icons-material";
import * as R from "ramda";

import Card from "../Card";
import { getRandomRotation, getRandomItemsSet } from "../../utils";
import { type IPlayer, useGame } from "../../hooks";
import { type ICard, type Token, cards } from "../../cards";

type Props = {
  playerID: IPlayer["id"];
  cardSize: string;
  className?: string;
};

const PlayerPane = ({ playerID, cardSize, className }: Props) => {
  const {
    getPlayer,
    answers,
    toggleHint,
    incrementScore,
    drawCard,
    players,
    setCommonCard,
  } = useGame();
  const { isHintShowing, score, card } = getPlayer(playerID);

  const handleTokenClick = (token: Token) => {
    if (token === answers[playerID]) {
      const inGameCardIDs = R.pluck(
        "id",
        R.pluck("card", players) as ICard[] // cards should exist at this stage
      );

      const avaliableCards = R.reject(
        R.where({ id: R.includes(R.__, inGameCardIDs) }),
        cards
      );

      const nextRandomCard = getRandomItemsSet(1, avaliableCards)[0];

      incrementScore(playerID);
      drawCard(playerID, nextRandomCard);
      setCommonCard(card);
    }
  };

  return (
    <Wrapper className={className}>
      <RotatedCard
        size={cardSize}
        tokens={card.tokens}
        onTokenClick={handleTokenClick}
        answer={isHintShowing ? answers[playerID] : undefined}
        onAnswerRevealed={() => toggleHint(playerID)}
      />
      <Controls>
        <Chip label={`Score: ${score}`} color="success" sx={{ mt: 2 }} />
        <HintIcon onClick={() => toggleHint(playerID)} />
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
