import { Controller, Post } from "@nestjs/common";
import { RoomService } from "./room.service";

@Controller("rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(): { roomId: string } {
    const roomId = this.roomService.createRoom();
    return { roomId };
  }
}
