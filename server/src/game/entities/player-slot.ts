import type { Card } from "@dobble/shared/types";

export type PlayerSlot = {
  id: number;
  playerId: string | null;
  name: string | null;
  socketId: string | null;
  card: Card;
  score: number;
  currentCardMistakes: number;
};
