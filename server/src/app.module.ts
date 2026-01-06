import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { HealthModule } from "./health/health.module";
import { RoomModule } from "./room/room.module";
import { GameModule } from "./game/game.module";

@Module({
  imports: [EventEmitterModule.forRoot(), HealthModule, RoomModule, GameModule],
})
export class AppModule {}
