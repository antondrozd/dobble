import { useSocketGame } from "@/hooks";
import { getRandomRotation } from "@/utils";
import { Button, CircularProgress, styled } from "@mui/material";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerPane from "../PlayerPane";
import Card from "../Card";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    status,
    gameState,
    error,
    connect,
    submitAnswer,
    requestHint,
    hint,
    resetGame,
    clearHint,
  } = useSocketGame();

  useEffect(() => {
    if (roomId && status === "disconnected") {
      void connect(roomId);
    }
  }, [roomId, status, connect]);

  const roomUrl = `${window.location.origin}/room/${roomId}`;

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(roomUrl);
  };

  const handleBackToLobby = () => {
    void navigate("/");
  };

  if (error) {
    return (
      <RoomContainer>
        <Title>Dobble</Title>
        <ErrorText>{error}</ErrorText>
        <Button variant="contained" onClick={handleBackToLobby}>
          Back to Lobby
        </Button>
      </RoomContainer>
    );
  }

  if (status === "connecting" || !gameState) {
    return (
      <RoomContainer>
        <Title>Dobble</Title>
        <CircularProgress />
      </RoomContainer>
    );
  }

  // Waiting for opponent
  if (!gameState.isGameActive) {
    return (
      <RoomContainer>
        <Title>Dobble</Title>
        <p>Waiting for opponent...</p>
        <RoomUrl>{roomUrl}</RoomUrl>
        <CopyButton onClick={handleCopyUrl}>Copy Link</CopyButton>
      </RoomContainer>
    );
  }

  const { slots, commonCard, winner, yourSlotId } = gameState;
  const yourSlot = slots.find((s) => s.id === yourSlotId);
  // const opponentSlot = slots.find((s) => s.id !== yourSlotId);

  if (
    !yourSlot
    // || !opponentSlot
  ) {
    return null;
  }

  if (winner) {
    return (
      <RoomContainer>
        <Title>{winner === yourSlotId ? "You won!" : "You lost!"}</Title>
        Your score: {yourSlot.score}
        <Button variant="contained" onClick={resetGame}>
          Play Again
        </Button>
      </RoomContainer>
    );
  }

  return (
    <Wrapper>
      {/* <OpponentPane slot={opponentSlot} isYou={false} /> */}
      <CommonCard tokens={commonCard.tokens} />
      <PlayerPane
        slot={yourSlot}
        isYou
        hint={hint}
        onTokenClick={submitAnswer}
        onHintClick={requestHint}
        onHintRevealed={clearHint}
      />
    </Wrapper>
  );
}

const RoomContainer = styled("main")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  gap: 16px;
`;

const Title = styled("h1")`
  font-size: 3rem;
  margin: 0;
`;

const ErrorText = styled("p")`
  color: red;
`;

const RoomUrl = styled("code")`
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin: 8px 0;
  word-break: break-all;
  max-width: 80%;
  text-align: center;
  user-select: text !important;
`;

const CopyButton = styled(Button)`
  margin-top: 8px;
`;

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

// const OpponentPane = styled(PlayerPane)`
//   transform: rotate(180deg);
// `;

const CommonCard = styled(Card)`
  transform: rotate(${getRandomRotation()});
`;
