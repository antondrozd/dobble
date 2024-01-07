import random from "random";
import { useMemo } from "react";
import { getRandomRotation } from "./utils";

const effectsCache = new WeakMap();
const defaultScalingParams = { min: 0.7, max: 1.7 };

export interface IEffects {
  rotations: string[];
  scales: number[];
}

export const useIconsEffects = (
  tokens: number[],
  scalingParams = defaultScalingParams
): IEffects => {
  const getRandomScale = () =>
    random.float(scalingParams.min, scalingParams.max);

  const iconsEffects = useMemo(() => {
    if (effectsCache.has(tokens)) {
      return effectsCache.get(tokens);
    }

    const effects = {
      rotations: tokens.map(getRandomRotation),
      scales: tokens.map(getRandomScale),
    };

    effectsCache.set(tokens, effects);

    return effects;
  }, [tokens]);

  return iconsEffects;
};
