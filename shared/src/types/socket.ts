import type { Token } from "./card";
import type { GameStateDto } from "./game";

export type ClientToServerEvents = {
  "game:join": (data: { roomId: string; name: string }) => void;
  "game:answer": (data: { token: Token }) => void;
  "game:skip": () => void;
  "game:reset": () => void;
};

export type ServerToClientEvents = {
  "game:state": (state: GameStateDto) => void;
  "game:skip": (data: { token: Token }) => void;
  "game:full": () => void;
  "room:not-found": () => void;
  "room:closed": () => void;
};
