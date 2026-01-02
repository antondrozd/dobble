import type { GameService } from "../services/game.service.ts";

export type Room = {
  id: string;
  createdAt: number;
  lastActivityAt: number;
  game: GameService;
};
