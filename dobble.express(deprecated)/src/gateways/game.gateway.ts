import type { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dobble/shared";
import type { GameService } from "../services/game.service.ts";
import type { RoomService } from "../services/room.service.ts";
import { mapGameStateToDto } from "./game.mapper.ts";

type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type GameServer = Server<ClientToServerEvents, ServerToClientEvents>;

// Track which room each socket belongs to
const socketRooms = new Map<string, string>();

const broadcastState = (io: GameServer, game: GameService) => {
  const state = game.getState();
  if (!state) return;

  for (const { id, socketId } of game.getSlots()) {
    if (!socketId) continue;
    io.to(socketId).emit("game:state", mapGameStateToDto(state, id));
  }
};

const getSocketRoom = (
  socketId: string,
  roomService: RoomService
): { roomId: string; game: GameService } | null => {
  const roomId = socketRooms.get(socketId);
  if (!roomId) return null;

  const entry = roomService.getRoom(roomId);
  if (!entry) return null;

  return { roomId, game: entry.game };
};

export const registerGameGateway = (
  io: GameServer,
  socket: GameSocket,
  roomService: RoomService
) => {
  socket.on("game:join", ({ roomId }) => {
    const entry = roomService.getRoom(roomId);
    if (!entry) {
      socket.emit("room:not-found");
      return;
    }

    const slotId = entry.game.addPlayer(socket.id);
    if (slotId === null) {
      socket.emit("game:full");
      return;
    }

    socketRooms.set(socket.id, roomId);
    socket.join(roomId);
    roomService.updateActivity(roomId);

    console.log(`Player joined room ${roomId} slot ${slotId}: ${socket.id}`);
    broadcastState(io, entry.game);
  });

  socket.on("game:answer", ({ token }) => {
    const ctx = getSocketRoom(socket.id, roomService);
    if (!ctx) return;

    const slotId = ctx.game.handleAnswerAttempt(socket.id, token);
    if (slotId !== null) {
      roomService.updateActivity(ctx.roomId);
      console.log(`Room ${ctx.roomId} slot ${slotId} answered correctly`);
      broadcastState(io, ctx.game);
    }
  });

  socket.on("game:hint", () => {
    const ctx = getSocketRoom(socket.id, roomService);
    if (!ctx) return;

    const token = ctx.game.getHint(socket.id);
    if (token !== null) {
      roomService.updateActivity(ctx.roomId);
      socket.emit("game:hint", { token });
      broadcastState(io, ctx.game);
    }
  });

  socket.on("game:reset", () => {
    const ctx = getSocketRoom(socket.id, roomService);
    if (!ctx) return;

    roomService.updateActivity(ctx.roomId);
    console.log(`Room ${ctx.roomId} reset`);
    ctx.game.reset();
    broadcastState(io, ctx.game);
  });

  socket.on("disconnect", () => {
    const ctx = getSocketRoom(socket.id, roomService);
    if (!ctx) return;

    const slotId = ctx.game.removePlayer(socket.id);
    socketRooms.delete(socket.id);

    if (slotId !== null) {
      console.log(
        `Player left room ${ctx.roomId} slot ${slotId}: ${socket.id}`
      );
      broadcastState(io, ctx.game);
    }
  });
};
