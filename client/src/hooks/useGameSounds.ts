import { useEffect } from "react";
import useSound from "use-sound";
import { usePrevious } from "@uidotdev/usehooks";

type GameSoundsParams = {
  yourScore?: number;
  yourSlotId?: number;
  winner?: number | null;
  isGameActive?: boolean;
};

export const useGameSounds = ({
  yourScore,
  yourSlotId,
  winner,
  isGameActive,
}: GameSoundsParams) => {
  const [playSuccess] = useSound("/sounds/success.wav");
  const [playError] = useSound("/sounds/error.wav");
  const [playSkip] = useSound("/sounds/skip.wav");
  const [playWin] = useSound("/sounds/win.wav");
  const [playLose] = useSound("/sounds/lose.wav");
  const [playBackground, { stop: stopBackground }] = useSound(
    "/sounds/background.wav",
    { volume: 0.3, loop: true }
  );

  const prevScore = usePrevious(yourScore);
  const prevWinner = usePrevious(winner);

  useEffect(() => {
    if (prevScore == null || yourScore == null) return;

    if (yourScore > prevScore) {
      playSuccess();
    } else if (yourScore < prevScore) {
      const isReset = yourScore === 0 && !winner;
      if (!isReset) playError();
    }
  }, [yourScore, prevScore, winner, playSuccess, playError]);

  useEffect(() => {
    if (!winner || winner === prevWinner) return;

    if (winner === yourSlotId) {
      playWin();
    } else {
      playLose();
    }
  }, [winner, prevWinner, yourSlotId, playWin, playLose]);

  useEffect(() => {
    if (isGameActive && !winner) {
      playBackground();
    } else {
      stopBackground();
    }
    return () => stopBackground();
  }, [isGameActive, winner, playBackground, stopBackground]);

  return { playSkip };
};
