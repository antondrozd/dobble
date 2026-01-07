import { Module } from "@nestjs/common";
import { SpriteService } from "./sprite.service";
import { SpriteController } from "./sprite.controller";

@Module({
  providers: [SpriteService],
  controllers: [SpriteController],
  exports: [SpriteService],
})
export class SpriteModule {}
