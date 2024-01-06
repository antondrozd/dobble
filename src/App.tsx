import { useCallback, useEffect, useState } from "react";
import random from "random";

import Card from "./components/Card";
import { TokensPerCardAmount, generateCards, type ICard } from "./utils";

import "./App.css";
import { Button, Chip, Switch, styled } from "@mui/material";
import { shuffle } from "lodash";
import * as R from "ramda";

const TOKENS_PER_CARD: TokensPerCardAmount = 8;
const WIN_SCORE = 10;

const cards = generateCards(TOKENS_PER_CARD);
const getRandomCard = () =>
  // @ts-ignore
  R.over(R.lensProp<ICard>("tokens"), shuffle, cards[random.int(0, 56)]);

function App() {
  const [player1Card, setPlayer1Card] = useState<ICard>(getRandomCard());
  const [player2Card, setPlayer2Card] = useState<ICard>(getRandomCard());
  const [commonCard, setCommonCard] = useState<ICard>(getRandomCard());

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [answer1Highlighted, setAnswer1Highlighted] = useState(false);
  const [answer2Highlighted, setAnswer2Highlighted] = useState(false);

  const commonToken1 = R.intersection(player1Card.tokens, commonCard.tokens)[0];
  const commonToken2 = R.intersection(player2Card.tokens, commonCard.tokens)[0];

  const handleToken1Click = useCallback(
    (token: number) => {
      if (token === commonToken1) {
        setPlayer1Score(R.inc);
        setCommonCard(player1Card);
        setPlayer1Card(getRandomCard());
      }
    },
    [commonToken1]
  );

  const handleToken2Click = useCallback(
    (token: number) => {
      if (token === commonToken2) {
        setPlayer2Score(R.inc);
        setCommonCard(player2Card);
        setPlayer2Card(getRandomCard());
      }
    },
    [commonToken2]
  );

  useEffect(() => {
    if (player1Score === WIN_SCORE) {
      alert("Player 1 wins!");
    }

    if (player2Score === WIN_SCORE) {
      alert("Player 2 wins!");
    }
  }, [player1Score, player2Score]);

  return (
    <>
      <Player1Pane>
        <Card
          tokens={player1Card.tokens}
          onTokenClick={handleToken1Click}
          answer={answer1Highlighted ? commonToken1 : undefined}
        />
        <Chip label={`Score: ${player1Score}`} color="success" />
        <Switch
          checked={answer1Highlighted}
          onChange={() => setAnswer1Highlighted(R.not)}
        />
      </Player1Pane>

      <CommonCard tokens={commonCard.tokens} />

      <Player2Pane>
        <Card
          tokens={player2Card.tokens}
          onTokenClick={handleToken2Click}
          answer={answer2Highlighted ? commonToken2 : undefined}
        />
        <Chip label={`Score: ${player2Score}`} color="success" />
        <Switch
          checked={answer2Highlighted}
          onChange={() => setAnswer2Highlighted(R.not)}
        />
      </Player2Pane>

      {/* <Button
        variant="contained"
        sx={{ mr: 2 }}
        color="error"
        onClick={() => setScore(0)}
      >
        Reset
      </Button> */}
      {/* <Button variant="contained" onClick={next}>
        Skip
      </Button> */}
    </>
  );
}

const PlayerPane = styled("div")``;

const Player1Pane = styled(PlayerPane)`
  transform: rotate(180deg);
`;
const Player2Pane = styled(PlayerPane)``;

const CommonCard = styled(Card)`
  transform: rotate(90deg);
`;

export default App;
