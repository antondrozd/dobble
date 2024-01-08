import { styled } from "@mui/material";

import Card from "./components/Card";
import { getRandomRotation } from "./utils";

import "./App.css";
// import { WIN_SCORE } from "./constants";
import PlayerPane from "./components/PlayerPane";
import { useCardSize, useGame } from "./hooks";

function App() {
  const cardSize = useCardSize();
  const { commonCard, players } = useGame();

  return (
    <Wrapper $windowHeight={window.innerHeight}>
      <PlayerPaneRotated cardSize={cardSize} playerID={players[0].id} />
      <CommonCard size={cardSize} tokens={commonCard.tokens} />
      <PlayerPane cardSize={cardSize} playerID={players[1].id} />
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
