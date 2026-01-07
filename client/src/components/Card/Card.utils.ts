import type { CSSProperties } from "react";

import type { TokensPerCard } from "@dobble/shared/types";

export const createIconTransformComputer =
  (iconsAmount: TokensPerCard) =>
  (
    iconIndex: number,
    { scales, rotations }: { scales: number[]; rotations: string[] }
  ): CSSProperties => {
    switch (iconsAmount) {
      // TODO: add more cases
      case 8: {
        // point in the direction where this icon should go
        const baseRotation = (360 / (iconsAmount - 1)) * iconIndex;
        // push outward from center
        const translation = iconIndex !== 0 ? "translate(220%)" : "";
        return {
          transform: `translate(-50%, -50%) rotate(${baseRotation}deg) ${translation} scale(${scales[iconIndex]}) rotate(${rotations[iconIndex]})`,
        };
      }
      default:
        return {};
    }
  };
