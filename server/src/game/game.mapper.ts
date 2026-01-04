import type { GameStateDto } from "@dobble/shared";
import type { GameState } from "./entities";

export const mapGameStateToDto = (
  state: GameState,
  slotId: number,
): GameStateDto => ({
  slots: state.slots.map(({ id, card, score }) => ({
    id,
    card,
    score,
  })),
  commonCard: state.commonCard,
  winner: state.winner,
  isGameActive: state.isGameActive,
  yourSlotId: slotId,
  seed: state.seed,
});
