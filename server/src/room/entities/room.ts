import type { GameService } from "../../game/game.service";

export type Room = {
  id: string;
  createdAt: number;
  lastActivityAt: number;
  game: GameService;
};
