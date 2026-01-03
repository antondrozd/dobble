import type { Card } from "@dobble/shared";

export type PlayerSlot = {
  id: number;
  socketId: string | null;
  card: Card;
  score: number;
};
