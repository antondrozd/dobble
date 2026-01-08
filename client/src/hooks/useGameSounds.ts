import useSound from "use-sound";

export const useGameSounds = () => {
  const [playSuccess] = useSound("/sounds/success.wav");
  const [playError] = useSound("/sounds/error.wav");
  const [playSkip] = useSound("/sounds/skip.wav");
  const [playWin] = useSound("/sounds/win.wav");
  const [playLose] = useSound("/sounds/lose.wav");
  const [playBackground, { stop: stopBackground }] = useSound(
    "/sounds/background.wav",
    { volume: 0.3, loop: true }
  );

  return {
    playSuccess,
    playError,
    playSkip,
    playWin,
    playLose,
    playBackground,
    stopBackground,
  };
};
