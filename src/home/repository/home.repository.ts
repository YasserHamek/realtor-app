import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Home } from "@prisma/client";
import { Model } from "mongoose";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "../controller/home.dto";
import { HomeDocument, IHome } from "../schema/home.schema";
import { IHomeRepository } from "./repository.interface";

@Injectable()
export class HomeRepositoryMongoDb implements IHomeRepository<IHome> {
  constructor(@InjectModel("Home") private homeModel: Model<IHome>) {}

  async create(createHomeDto: CreateHomeDto): Promise<IHome> {
    const home = new this.homeModel(createHomeDto);
    return (await home.save()).toObject();
  }

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<IHome[]> {
    return await this.homeModel.find(this.getQuery(homeFilterDto)).lean();
  }

  async getById(id: string): Promise<IHome> {
    return (await this.homeModel.findById(id).exec())?.toObject();
  }

  async updateById(homeId: string, updateHomeDto: UpdateHomeDto): Promise<IHome> {
    return this.homeModel.findByIdAndUpdate(homeId, updateHomeDto, { new: true }).lean(); // { new: true } Option will let us get the updated Home
  }

  async deleteById(homeId: string): Promise<HomeDocument> {
    return await this.homeModel.findByIdAndDelete(homeId).lean();
  }

  private getQuery(homeFilterDto: HomeFilterDto) {
    const query: any = {};

    if (homeFilterDto.price?.gte) query.price = { $gte: homeFilterDto.price.gte };
    if (homeFilterDto.price?.lte) query.price = { ...query.price, $lte: homeFilterDto.price.lte };
    if (homeFilterDto.city) query.city = homeFilterDto.city;
    if (homeFilterDto.propertyType) query.propertyType = homeFilterDto.propertyType;

    return query;
  }
}

@Injectable()
export class HomeRepositoryPrisma implements IHomeRepository<CreateHomeDto> {
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

  async getById(id: string): Promise<Home> {
    return await this.prismaService.home.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async updateById(id: string, updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
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

  async deleteById(id: string): Promise<UpdateHomeDto> {
    return await this.prismaService.home.delete({
      where: {
        id: parseInt(id),
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
