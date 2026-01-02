import type { Express } from "express";
import type { RoomService } from "../services/room.service.ts";

export const registerRoomController = (
  app: Express,
  roomService: RoomService
) => {
  app.post("/rooms", (_req, res) => {
    const roomId = roomService.createRoom();
    res.json({ roomId });
  });
};
