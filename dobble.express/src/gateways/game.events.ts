import type { Token } from "../entities/index.ts";
import type { GameStateDto } from "../dto/game.dto.ts";

export type ClientToServerEvents = {
  "game:join": (data: { roomId: string }) => void;
  "game:answer": (data: { token: Token }) => void;
  "game:hint": () => void;
  "game:reset": () => void;
};

export type ServerToClientEvents = {
  "game:state": (state: GameStateDto) => void;
  "game:hint": (data: { token: Token }) => void;
  "game:full": () => void;
  "room:not-found": () => void;
};
