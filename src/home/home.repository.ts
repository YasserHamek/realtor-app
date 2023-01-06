import { Injectable } from "@nestjs/common";
import { Home } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Image, CreateHomeDto } from "./home.dto";

@Injectable()
export class HomeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createHome(createHomeDto: CreateHomeDto, id: number): Promise<Home> {
    return await this.prismaService.home.create({
      data: {
        adress: createHomeDto.adress,
        city: createHomeDto.city,
        landSize: createHomeDto.landSize,
        numberOfBathrooms: createHomeDto.numberOfBathrooms,
        numberOfBedrooms: createHomeDto.numberOfBedrooms,
        price: createHomeDto.price,
        propertyType: createHomeDto.propertyType,
        realtorId: id,
      },
    });
  }

  async createImages(images: Image[]) {
    await this.prismaService.image.createMany({
      data: images,
    });
  }
}
