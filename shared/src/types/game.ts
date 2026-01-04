import type { Card } from "./card.js";

export type PlayerSlotDto = {
  id: number;
  card: Card;
  score: number;
};

export type GameStateDto = {
  slots: PlayerSlotDto[];
  commonCard: Card;
  winner: number | null;
  isGameActive: boolean;
  yourSlotId: number;
  seed: number;
};
