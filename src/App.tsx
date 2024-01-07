import { useEffect, useLayoutEffect, useState, useTransition } from "react";
import { Chip, Switch, styled } from "@mui/material";
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

  const [answer1Highlighted, setAnswer1Highlighted] = useState(false);
  const [answer2Highlighted, setAnswer2Highlighted] = useState(false);

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
      setAnswer1Highlighted(false);
      setAnswer2Highlighted(false);
    }

    if (player2Score === WIN_SCORE) {
      alert("Player 2 won!");
      setPlayer1Score(0);
      setPlayer2Score(0);
      setAnswer1Highlighted(false);
      setAnswer2Highlighted(false);
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
          answer={answer1Highlighted ? commonToken1 : undefined}
        />
        <Chip label={`Score: ${player1Score}`} color="success" sx={{ mt: 2 }} />
        <Switch
          checked={answer1Highlighted}
          onChange={() => setAnswer1Highlighted(R.not)}
        />
      </PlayerPaneRotated>

      <CommonCard size={cardSize} tokens={commonCard.tokens} />

      <PlayerPane>
        <Player2Card
          size={cardSize}
          tokens={player2Card.tokens}
          onTokenClick={handleToken2Click}
          answer={answer2Highlighted ? commonToken2 : undefined}
        />
        <Chip label={`Score: ${player2Score}`} color="success" sx={{ mt: 2 }} />
        <Switch
          checked={answer2Highlighted}
          onChange={() => setAnswer2Highlighted(R.not)}
        />
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
`;

const PlayerPane = styled("div")`
  display: flex;
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
