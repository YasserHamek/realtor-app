import { Injectable } from "@nestjs/common";
import { Home } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "../home.dto";
import { IHomeRepository } from "./repository.interface";

@Injectable()
export class HomeRepositoryPrisma implements IHomeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createHomeDto: CreateHomeDto): Promise<Home> {
    return await this.prismaService.home.create({
      data: {
        adress: createHomeDto.adress,
        city: createHomeDto.city,
        landSize: createHomeDto.landSize,
        numberOfBathrooms: createHomeDto.numberOfBathrooms,
        numberOfBedrooms: createHomeDto.numberOfBedrooms,
        price: createHomeDto.price,
        propertyType: createHomeDto.propertyType,
        realtorId: createHomeDto.realtorId,
      },
    });
  }

  async getById(id: number): Promise<Home> {
    return await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateById(id: number, updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
    return await this.prismaService.home.update({
      where: {
        id: updateHomeDto.id,
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

  async deleteById(id: number): Promise<UpdateHomeDto> {
    return await this.prismaService.home.delete({
      where: {
        id: id,
      },
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
}
