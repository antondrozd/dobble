import { css } from "@emotion/react";

import { type TokensPerCard } from "@dobble/shared";

export const createIconTransformComputer =
  (iconsAmount: TokensPerCard) =>
  (
    iconIndex: number,
    { scales, rotations }: { scales: number[]; rotations: string[] }
  ) => {
    switch (iconsAmount) {
      // TODO: add more cases
      case 8:
        return css`
          transform: translate(-50%, -50%)
            rotate(${(360 / (iconsAmount - 1)) * iconIndex}deg)
            ${iconIndex !== 0 && `translate(220%)`} scale(${scales[iconIndex]})
            rotate(${rotations[iconIndex]});
        `;
    }
  };
