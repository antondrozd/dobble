import type { Card } from "./card";

type Player = {
  name: string;
};

type BaseSlotDto = {
  id: number;
  card: Card;
  score: number;
};

export type EmptySlotDto = BaseSlotDto & {
  player: null;
};

export type SlotDto = BaseSlotDto & {
  player: Player;
};

type BaseGameStateDto = {
  commonCard: Card;
  winner: number | null;
  yourSlotId: number;
  yourPlayerId: string;
  seed: number;
};

export type InactiveGameStateDto = BaseGameStateDto & {
  isGameActive: false;
  slots: (SlotDto | EmptySlotDto)[];
};

export type ActiveGameStateDto = BaseGameStateDto & {
  isGameActive: true;
  slots: SlotDto[];
};

export type GameStateDto = InactiveGameStateDto | ActiveGameStateDto;
