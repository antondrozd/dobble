import { useSocketGame } from "@/hooks";
import { CircularProgress, Button, TextField, styled } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const navigate = useNavigate();
  const { status, error, connect } = useSocketGame();
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateGame = () => {
    void connect().then((roomId) => {
      if (roomId) {
        void navigate(`/room/${roomId}`);
      }
    });
  };

  const handleJoinGame = () => {
    if (joinRoomId) {
      void navigate(`/room/${joinRoomId}`);
    }
  };

  return (
    <LobbyContainer>
      <Title>Dobble</Title>

      {error && <ErrorText>{error}</ErrorText>}
      {status === "connecting" && <CircularProgress />}
      {status === "disconnected" && (
        <>
          <Button variant="contained" size="large" onClick={handleCreateGame}>
            Create Game
          </Button>

          <Divider>or</Divider>

          <JoinSection>
            <TextField
              label="Room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value.trim())}
              size="small"
            />
            <Button
              variant="outlined"
              onClick={handleJoinGame}
              disabled={!joinRoomId}
            >
              Join
            </Button>
          </JoinSection>
        </>
      )}
    </LobbyContainer>
  );
}

const LobbyContainer = styled("main")`
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

const Divider = styled("span")`
  color: #666;
  margin: 8px 0;
`;

const JoinSection = styled("div")`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ErrorText = styled("p")`
  color: red;
`;
