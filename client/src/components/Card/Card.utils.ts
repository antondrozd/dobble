import type { CSSProperties } from "react";

import { type TokensPerCard } from "@dobble/shared";

export const createIconTransformComputer =
  (iconsAmount: TokensPerCard) =>
  (
    iconIndex: number,
    { scales, rotations }: { scales: number[]; rotations: string[] }
  ): CSSProperties => {
    switch (iconsAmount) {
      // TODO: add more cases
      case 8: {
        const baseRotation = (360 / (iconsAmount - 1)) * iconIndex;
        const translation = iconIndex !== 0 ? "translate(220%)" : "";
        return {
          transform: `translate(-50%, -50%) rotate(${baseRotation}deg) ${translation} scale(${scales[iconIndex]}) rotate(${rotations[iconIndex]})`,
        };
      }
      default:
        return {};
    }
  };
