import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { Room } from "./entities";
import { GameService } from "../game/game.service";
import { ROOM_TIMEOUT_MS } from "../constants";

@Injectable()
export class RoomService implements OnModuleInit, OnModuleDestroy {
  private rooms = new Map<string, Room>();
  private cleanupInterval: NodeJS.Timeout;

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
      let deletedCount = 0;

      for (const [id, room] of this.rooms) {
        if (now - room.lastActivityAt > ROOM_TIMEOUT_MS) {
          this.rooms.delete(id);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} stale room(s)`);
      }
    }, 60 * 1000);
  }
}
