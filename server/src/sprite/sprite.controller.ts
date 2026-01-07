import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SpriteService } from "./sprite.service";

@Controller("sprites")
export class SpriteController {
  constructor(private readonly spriteService: SpriteService) {}

  @Post("generate")
  @UseInterceptors(FilesInterceptor("icons"))
  async generate(
    @UploadedFiles() files: Express.Multer.File[],
    @Body("packName") packName: string,
  ) {
    const spritePath = await this.spriteService.generateSprite(files, packName);
    return { path: spritePath };
  }
}
