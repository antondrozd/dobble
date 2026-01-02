import type { Card } from "./card.ts";

export type PlayerSlot = {
  id: number;
  socketId: string | null;
  card: Card;
  score: number;
};
