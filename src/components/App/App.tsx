import { styled } from "@mui/material";

import Card from "@/components/Card";
import PlayerPane from "@/components/PlayerPane";
import { getRandomRotation } from "@/utils";
import { useGame } from "@/hooks";
import { useEffect } from "react";

function App() {
  const { commonCard, players, winner, reset } = useGame();

  useEffect(() => {
    if (winner) {
      alert(`Player ${winner} won!`);
      reset();
    }
  }, [reset, winner]);

  return (
    <Wrapper>
      <PlayerPaneRotated playerID={players[0].id} />
      <CommonCard tokens={commonCard.tokens} />
      <PlayerPane playerID={players[1].id} />
    </Wrapper>
  );
}

const Wrapper = styled("main")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100dvh;
  padding: 2dvh;
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
