import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RoomService } from "./room.service";

describe("RoomService", () => {
  let service: RoomService;

  beforeEach(() => {
    service = new RoomService();
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  describe("createRoom", () => {
    it("returns a room id", () => {
      const id = service.createRoom();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("creates unique room ids", () => {
      const id1 = service.createRoom();
      const id2 = service.createRoom();
      expect(id1).not.toBe(id2);
    });

    it("room can be retrieved after creation", () => {
      const id = service.createRoom();
      const room = service.getRoom(id);
      expect(room).not.toBeNull();
      expect(room?.id).toBe(id);
    });

    it("room has a game instance", () => {
      const id = service.createRoom();
      const room = service.getRoom(id);
      expect(room?.game).toBeDefined();
    });
  });

  describe("getRoom", () => {
    it("returns null for non-existent room", () => {
      const room = service.getRoom("non-existent-id");
      expect(room).toBeNull();
    });

    it("returns room for valid id", () => {
      const id = service.createRoom();
      const room = service.getRoom(id);
      expect(room).not.toBeNull();
    });
  });

  describe("deleteRoom", () => {
    it("returns true when room deleted", () => {
      const id = service.createRoom();
      const result = service.deleteRoom(id);
      expect(result).toBe(true);
    });

    it("returns false when room does not exist", () => {
      const result = service.deleteRoom("non-existent-id");
      expect(result).toBe(false);
    });

    it("room is no longer retrievable after deletion", () => {
      const id = service.createRoom();
      service.deleteRoom(id);
      const room = service.getRoom(id);
      expect(room).toBeNull();
    });
  });

  describe("updateActivity", () => {
    it("updates lastActivityAt timestamp", async () => {
      const id = service.createRoom();
      const room = service.getRoom(id)!;
      const originalTime = room.lastActivityAt;

      await new Promise((resolve) => setTimeout(resolve, 10));
      service.updateActivity(id);

      expect(room.lastActivityAt).toBeGreaterThan(originalTime);
    });

    it("does nothing for non-existent room", () => {
      expect(() => service.updateActivity("non-existent")).not.toThrow();
    });
  });
});
