import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Image } from "../home.dto";
import { IImageRepository } from "./repository.interface";

@Injectable()
export class ImageRepository implements IImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createImages(images: Image[]) {
    await this.prismaService.image.createMany({
      data: images,
    });
  }
}
