import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { randomUUID } from "node:crypto";
import type { Room } from "./entities";
import { RoomCleanupEvent } from "./events";
import { GameService } from "../game/game.service";

const ROOM_TIMEOUT_MS = 5 * 60 * 1000;
const CLEANUP_SCHEDULER_INTERVAL_MS = 3 * 60 * 1000;

@Injectable()
export class RoomService implements OnModuleInit, OnModuleDestroy {
  private rooms = new Map<string, Room>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.initCleanupScheduler();
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  createRoom(): string {
    const id = randomUUID();
    const now = Date.now();

    const room: Room = {
      id,
      createdAt: now,
      lastActivityAt: now,
      game: new GameService(),
    };

    this.rooms.set(id, room);

    console.log(`Created room ${id}`);
    return id;
  }

  getRoom(id: string): Room | null {
    return this.rooms.get(id) ?? null;
  }

  deleteRoom(id: string): boolean {
    return this.rooms.delete(id);
  }

  updateActivity(id: string): void {
    const room = this.rooms.get(id);
    if (room) {
      room.lastActivityAt = Date.now();
    }
  }

  private initCleanupScheduler(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleRoomIds: string[] = [];

      for (const [id, room] of this.rooms) {
        if (now - room.lastActivityAt > ROOM_TIMEOUT_MS) {
          staleRoomIds.push(id);
        }
      }

      for (const id of staleRoomIds) {
        this.eventEmitter.emit(
          RoomCleanupEvent.event,
          new RoomCleanupEvent(id),
        );
        this.rooms.delete(id);
        console.log(`Cleaned up stale room: ${id}`);
      }
    }, CLEANUP_SCHEDULER_INTERVAL_MS);
  }
}
