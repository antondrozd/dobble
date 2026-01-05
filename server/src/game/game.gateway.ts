import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dobble/shared/types";
import { RoomService } from "../room/room.service";
import { GameService } from "./game.service";
import { mapGameStateToDto } from "./game.mapper";

type EventPayload<K extends keyof ClientToServerEvents> = Parameters<
  ClientToServerEvents[K]
>[0];

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  private socketRooms = new Map<string, string>();

  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);

    const ctx = this.getSocketRoom(client.id);
    if (!ctx) return;

    const slotId = ctx.game.removePlayer(client.id);
    this.socketRooms.delete(client.id);

    if (slotId !== null) {
      console.log(
        `Player left room ${ctx.roomId} slot ${slotId}: ${client.id}`,
      );
      this.broadcastState(ctx.game);
    }
  }

  @SubscribeMessage("game:join")
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EventPayload<"game:join">,
  ) {
    const entry = this.roomService.getRoom(data.roomId);
    if (!entry) {
      client.emit("room:not-found");
      return;
    }

    const slotId = entry.game.addPlayer(client.id, data.name);
    if (slotId === null) {
      client.emit("game:full");
      return;
    }

    this.socketRooms.set(client.id, data.roomId);
    client.join(data.roomId);
    this.roomService.updateActivity(data.roomId);

    console.log(
      `Player joined room ${data.roomId} slot ${slotId}: ${client.id}`,
    );
    this.broadcastState(entry.game);
  }

  @SubscribeMessage("game:answer")
  handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EventPayload<"game:answer">,
  ) {
    const ctx = this.getSocketRoom(client.id);
    if (!ctx) return;

    const slotId = ctx.game.handleAnswerAttempt(client.id, data.token);
    if (slotId !== null) {
      this.roomService.updateActivity(ctx.roomId);
      console.log(`Room ${ctx.roomId} slot ${slotId} answered correctly`);
      this.broadcastState(ctx.game);
    }
  }

  @SubscribeMessage("game:hint")
  handleHint(@ConnectedSocket() client: Socket) {
    const ctx = this.getSocketRoom(client.id);
    if (!ctx) return;

    const token = ctx.game.getHint(client.id);
    if (token !== null) {
      this.roomService.updateActivity(ctx.roomId);
      client.emit("game:hint", { token });
      this.broadcastState(ctx.game);
    }
  }

  @SubscribeMessage("game:reset")
  handleReset(@ConnectedSocket() client: Socket) {
    const ctx = this.getSocketRoom(client.id);
    if (!ctx) return;

    this.roomService.updateActivity(ctx.roomId);
    console.log(`Room ${ctx.roomId} reset`);
    ctx.game.reset();
    this.broadcastState(ctx.game);
  }

  private getSocketRoom(
    socketId: string,
  ): { roomId: string; game: GameService } | null {
    const roomId = this.socketRooms.get(socketId);
    if (!roomId) return null;

    const entry = this.roomService.getRoom(roomId);
    if (!entry) return null;

    return { roomId, game: entry.game };
  }

  private broadcastState(game: GameService) {
    const state = game.getState();
    if (!state) return;

    for (const { id, socketId } of game.getSlots()) {
      if (!socketId) continue;
      this.server.to(socketId).emit("game:state", mapGameStateToDto(state, id));
    }
  }
}
