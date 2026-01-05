import { useMemo } from "react";
import seedrandom from "seedrandom";

import type { Token } from "@dobble/shared/types";
import { useSeed } from "./useSeed";

export type Effects = {
  rotations: string[];
  scales: number[];
};

const defaultScalingParams = { min: 0.7, max: 1.7 };

export const useIconsTransform = (
  tokens: Token[],
  scalingParams = defaultScalingParams
): Effects => {
  const seed = useSeed((state) => state.seed);

  return useMemo(() => {
    const rng = seedrandom(`${seed}:${tokens.join(",")}`);

    const getRandomRotation = () => `${Math.floor(rng() * 360)}deg`;
    const getRandomScale = () =>
      scalingParams.min + rng() * (scalingParams.max - scalingParams.min);

    return {
      rotations: tokens.map(getRandomRotation),
      scales: tokens.map(getRandomScale),
    };
  }, [seed, tokens, scalingParams.min, scalingParams.max]);
};
