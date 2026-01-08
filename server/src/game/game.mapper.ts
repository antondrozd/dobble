import type { GameStateDto } from "@dobble/shared/types";
import type { GameState } from "./entities";

export const mapGameStateToDto = (
  state: GameState,
  slotId: number,
): GameStateDto => {
  const yourSlot = state.slots.find((s) => s.id === slotId)!;
  return {
    slots: state.slots.map(({ id, name, card, score }) => ({
      id,
      player: name ? { name } : null,
      card,
      score,
    })),
    commonCard: state.commonCard,
    winner: state.winner,
    isGameActive: state.isGameActive,
    yourSlotId: slotId,
    yourPlayerId: yourSlot.playerId,
    seed: state.seed,
  };
};
