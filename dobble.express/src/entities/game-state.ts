import type { Card } from "./card.ts";
import type { PlayerSlot } from "./player-slot.ts";

export type GameState = {
  slots: PlayerSlot[];
  commonCard: Card;
  winner: number | null;
  isGameActive: boolean;
};
