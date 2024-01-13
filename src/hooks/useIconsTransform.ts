import random from "random";
import { useCallback, useMemo } from "react";

import { getRandomRotation } from "@/utils";
import { type Token } from "@/cards";

export interface IEffects {
  rotations: string[];
  scales: number[];
}

const effectsCache = new WeakMap<Token[], IEffects>();
const defaultScalingParams = { min: 0.7, max: 1.7 };

export const useIconsTransform = (
  tokens: Token[],
  scalingParams = defaultScalingParams
): IEffects => {
  const getRandomScale = useCallback(
    () => random.float(scalingParams.min, scalingParams.max),
    [scalingParams.max, scalingParams.min]
  );

  const iconsEffects = useMemo(() => {
    if (effectsCache.has(tokens)) {
      return effectsCache.get(tokens) as IEffects;
    }

    const effects = {
      rotations: tokens.map(getRandomRotation),
      scales: tokens.map(getRandomScale),
    };

    effectsCache.set(tokens, effects);

    return effects;
  }, [getRandomScale, tokens]);

  return iconsEffects;
};
