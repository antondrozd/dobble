import { useEffect, useLayoutEffect, useState, useTransition } from "react";
import { Chip, styled } from "@mui/material";
import { EmojiObjectsTwoTone } from "@mui/icons-material";

import * as R from "ramda";

import Card from "./components/Card";
import {
  createRandomCardSelector,
  getRandomRotation,
  type ICard,
} from "./utils";

import "./App.css";
import { WIN_SCORE } from "./constants";
import { cards } from "./cards";

const getRandomCard = createRandomCardSelector(cards);
const getCardSize = () => `${window.innerHeight * 0.3}px`;

function App() {
  const [cardSize, setCardSize] = useState(getCardSize());
  const [, startTransition] = useTransition();

  const [player1Card, setPlayer1Card] = useState<ICard | null>(null);
  const [player2Card, setPlayer2Card] = useState<ICard | null>(null);
  const [commonCard, setCommonCard] = useState<ICard | null>(null);

  // const [winScore, setWinScore] = useState(WIN_SCORE);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [revealPlayer1Answer, setRevealPlayer1Answer] = useState(false);
  const [revealPlayer2Answer, setRevealPlayer2Answer] = useState(false);

  const commonToken1: number | undefined = R.intersection(
    player1Card?.tokens ?? [],
    commonCard?.tokens ?? []
  )[0];
  const commonToken2: number | undefined = R.intersection(
    player2Card?.tokens ?? [],
    commonCard?.tokens ?? []
  )[0];

  const handleToken1Click = (token: number) => {
    if (!player1Card || !player2Card) {
      return;
    }

    if (token === commonToken1) {
      setPlayer1Score(R.inc);
      setCommonCard(player1Card);
      setPlayer1Card(
        getRandomCard({ excludeIDs: [player1Card.id, player2Card.id] })
      );
    }
  };

  const handleToken2Click = (token: number) => {
    if (!player1Card || !player2Card) {
      return;
    }

    if (token === commonToken2) {
      setPlayer2Score(R.inc);
      setCommonCard(player2Card);
      setPlayer2Card(
        getRandomCard({ excludeIDs: [player1Card.id, player2Card.id] })
      );
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      startTransition(() => {
        setCardSize(getCardSize());
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const first = getRandomCard({ excludeIDs: [] });
    const second = getRandomCard({ excludeIDs: [first.id] });
    const third = getRandomCard({ excludeIDs: [first.id, second.id] });

    setPlayer1Card(first);
    setPlayer2Card(second);
    setCommonCard(third);
  }, []);

  useEffect(() => {
    if (player1Score === WIN_SCORE) {
      alert("Player 1 won!");
      setPlayer1Score(0);
      setPlayer2Score(0);
    }

    if (player2Score === WIN_SCORE) {
      alert("Player 2 won!");
      setPlayer1Score(0);
      setPlayer2Score(0);
    }
  }, [player1Score, player2Score]);

  if (!player1Card || !player2Card || !commonCard) {
    return null;
  }

  return (
    <Wrapper $windowHeight={window.innerHeight}>
      <PlayerPaneRotated>
        <Player1Card
          size={cardSize}
          tokens={player1Card.tokens}
          onTokenClick={handleToken1Click}
          answer={revealPlayer1Answer ? commonToken1 : undefined}
          onAnswerRevealed={() => setRevealPlayer1Answer(false)}
        />
        <PlayerControls>
          <Chip
            label={`Score: ${player1Score}`}
            color="success"
            sx={{ mt: 2 }}
          />
          <HintIcon onClick={() => setRevealPlayer1Answer(true)} />
        </PlayerControls>
      </PlayerPaneRotated>

      <CommonCard size={cardSize} tokens={commonCard.tokens} />

      <PlayerPane>
        <Player2Card
          size={cardSize}
          tokens={player2Card.tokens}
          onTokenClick={handleToken2Click}
          answer={revealPlayer2Answer ? commonToken2 : undefined}
          onAnswerRevealed={() => setRevealPlayer2Answer(false)}
        />
        <PlayerControls>
          <Chip
            label={`Score: ${player2Score}`}
            color="success"
            sx={{ mt: 2 }}
          />
          <HintIcon onClick={() => setRevealPlayer2Answer(true)} />
        </PlayerControls>
      </PlayerPane>
    </Wrapper>
  );
}

const Wrapper = styled("main")<{ $windowHeight: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: ${({ $windowHeight }) => `${$windowHeight}px`};
  padding: ${({ $windowHeight }) => `${$windowHeight * 0.02}px`};
  box-sizing: border-box;
  overflow: hidden;
`;

const PlayerPane = styled("div")`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const PlayerControls = styled("div")`
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

const PlayerPaneRotated = styled(PlayerPane)`
  transform: rotate(180deg);
`;

const Player1Card = styled(Card)`
  transform: rotate(${getRandomRotation()});
`;

const Player2Card = styled(Card)`
  transform: rotate(${getRandomRotation()});
`;

const CommonCard = styled(Card)`
  transform: rotate(${getRandomRotation()});
`;

export default App;
