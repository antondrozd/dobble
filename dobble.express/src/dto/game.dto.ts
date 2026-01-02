import type { PlayerSlot, GameState } from "../entities/index.ts";

export type PlayerSlotDto = Omit<PlayerSlot, "socketId">;

export type GameStateDto = Omit<GameState, "slots"> & {
  slots: PlayerSlotDto[];
  yourSlotId: number;
};
