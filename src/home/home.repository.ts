import { Injectable } from "@nestjs/common";
import { Home } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Image, CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "./home.dto";

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

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<any> {
    return await this.prismaService.home.findMany({
      select: {
        adress: true,
        city: true,
        id: true,
        landSize: true,
        numberOfBathrooms: true,
        numberOfBedrooms: true,
        price: true,
        propertyType: true,
        realtorId: true,
        images: {
          select: {
            url: true,
            id: true,
          },
        },
      },
      where: homeFilterDto,
    });
  }

  async updateHomeById(id: number, updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
    return await this.prismaService.home.update({
      where: {
        id,
      },
      data: {
        adress: updateHomeDto.adress,
        city: updateHomeDto.city,
        landSize: updateHomeDto.landSize,
        numberOfBathrooms: updateHomeDto.numberOfBathrooms,
        numberOfBedrooms: updateHomeDto.numberOfBedrooms,
        price: updateHomeDto.price,
        propertyType: updateHomeDto.propertyType,
      },
    });
  }
}
