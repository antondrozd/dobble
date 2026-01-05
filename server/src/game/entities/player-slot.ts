import type { Card } from "@dobble/shared/types";

export type PlayerSlot = {
  id: number;
  name: string;
  socketId: string | null;
  card: Card;
  score: number;
};
