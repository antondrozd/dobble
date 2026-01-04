import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { RoomModule } from "./room/room.module";
import { GameModule } from "./game/game.module";

@Module({
  imports: [HealthModule, RoomModule, GameModule],
})
export class AppModule {}
