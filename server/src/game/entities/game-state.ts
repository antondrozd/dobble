import type { Card } from "@dobble/shared";
import type { PlayerSlot } from "./player-slot";

export type GameState = {
  slots: PlayerSlot[];
  commonCard: Card;
  winner: number | null;
  isGameActive: boolean;
  seed: number;
};
