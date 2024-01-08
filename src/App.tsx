import { useEffect, useLayoutEffect, useState } from "react";
import { styled } from "@mui/material";
import { throttle } from "lodash";
import * as R from "ramda";

import Card from "./components/Card";
import { createRandomCardSelector, getRandomRotation } from "./utils";

import "./App.css";
// import { WIN_SCORE } from "./constants";
import { cards } from "./cards";
import { useGame } from "./store";
import PlayerPane from "./components/PlayerPane";

const getRandomCard = createRandomCardSelector(cards);
const getCardSize = () => `${window.innerHeight * 0.3}px`;

function App() {
  const [cardSize, setCardSize] = useState(getCardSize());

  const { players, drawCard, commonCard, setCommonCard } = useGame();

  useLayoutEffect(() => {
    const handleResize = throttle(() => setCardSize(getCardSize()), 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const first = getRandomCard({ excludeIDs: [] });
    const second = getRandomCard({ excludeIDs: [first.id] });
    const common = getRandomCard({ excludeIDs: [first.id, second.id] });

    drawCard(1, first);
    drawCard(2, second);
    setCommonCard(common);
  }, []);

  if (R.any((player) => R.isNil(player.card), players) || !commonCard) {
    return null;
  }

  return (
    <Wrapper $windowHeight={window.innerHeight}>
      <PlayerPaneRotated cardSize={cardSize} playerID={1} />
      <CommonCard size={cardSize} tokens={commonCard.tokens} />
      <PlayerPane cardSize={cardSize} playerID={2} />
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

const PlayerPaneRotated = styled(PlayerPane)`
  transform: rotate(180deg);
`;

const CommonCard = styled(Card)`
  transform: rotate(${getRandomRotation()});
`;

export default App;
