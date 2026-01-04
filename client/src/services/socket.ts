import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dobble/shared";
import { SERVER_URL } from "@/api";

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const createSocket = (): GameSocket => {
  return io(SERVER_URL, {
    autoConnect: false,
  });
};
