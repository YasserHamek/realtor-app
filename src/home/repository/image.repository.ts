import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ImageDto } from "../controller/home.dto";
import { IImageRepository } from "./repository.interface";

@Injectable()
export class ImageRepository implements IImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createImages(images: ImageDto[]) {
    // await this.prismaService.image.createMany({
    //   data: images,
    // });
  }
}
