import type { Card } from "./card";

export type PlayerSlotDto = {
  id: number;
  name: string;
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
