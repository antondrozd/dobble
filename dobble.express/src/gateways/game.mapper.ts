import type { GameState } from "../entities/index.ts";
import type { GameStateDto } from "../dto/index.ts";

export const mapGameStateToDto = (
  state: GameState,
  slotId: number
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
});
