import random from "random";
import { useMemo } from "react";

const defaultScalingParams = { min: 0.7, max: 1.7 };

export const useIconsEffects = (
  tokens: number[],
  scalingParams = defaultScalingParams
) => {
  const getRandomRotation = () => `${random.int(0, 360)}deg`;
  const getRandomScale = () =>
    random.float(scalingParams.min, scalingParams.max);

  const rotations = useMemo(
    () => Array.from({ length: tokens.length }, getRandomRotation),
    [tokens]
  );

  const scales = useMemo(
    () => Array.from({ length: tokens.length }, getRandomScale),
    [tokens]
  );

  console.log({ rotations, scales });

  return { rotations, scales };
};
