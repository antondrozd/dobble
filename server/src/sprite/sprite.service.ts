import { Injectable, BadRequestException } from "@nestjs/common";
import sharp from "sharp";
import * as path from "path";
import * as fs from "fs/promises";

const ICON_SIZE = 130;
const GRID_COLUMNS = 8;
const PACK_NAME_REGEX = /^[a-z0-9_-]+$/i;

@Injectable()
export class SpriteService {
  async generateSprite(
    files: Express.Multer.File[],
    packName: string,
  ): Promise<string> {
    if (!files || files.length === 0) {
      throw new BadRequestException("No icon files provided");
    }

    if (!packName || !PACK_NAME_REGEX.test(packName)) {
      throw new BadRequestException(
        "Invalid pack name. Use only letters, numbers, hyphens, and underscores",
      );
    }

    const iconCount = files.length;
    const gridRows = Math.ceil(iconCount / GRID_COLUMNS);
    const spriteWidth = GRID_COLUMNS * ICON_SIZE;
    const spriteHeight = gridRows * ICON_SIZE;

    const resizedIcons = await Promise.all(
      files.map(async (file, index) => {
        try {
          return await sharp(file.buffer)
            .resize(ICON_SIZE, ICON_SIZE)
            .toBuffer();
        } catch {
          throw new BadRequestException(
            `Failed to process icon at index ${index}: invalid image format`,
          );
        }
      }),
    );

    const compositeInputs = resizedIcons.map((buffer, index) => ({
      input: buffer,
      left: (index % GRID_COLUMNS) * ICON_SIZE,
      top: Math.floor(index / GRID_COLUMNS) * ICON_SIZE,
    }));

    const sprite = await sharp({
      create: {
        width: spriteWidth,
        height: spriteHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(compositeInputs)
      .png()
      .toBuffer();

    const outputDir = path.resolve(
      __dirname,
      "../../..",
      "client/public/icon-packs",
      packName,
    );
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "sprite.png");
    await fs.writeFile(outputPath, sprite);

    return `/icon-packs/${packName}/sprite.png`;
  }
}
