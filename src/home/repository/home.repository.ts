import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Home, PropertyType as PropertyTypePrisma } from "@prisma/client";
import { Model } from "mongoose";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "../controller/home.dto";
import { GenericRepository } from "../../common/generic/repository/generic.repository.interface";

export interface IHomeRepository<R> extends GenericRepository<CreateHomeDto, R> {
  getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<any>;
}

@Injectable()
export class HomeRepositoryMongoDb implements IHomeRepository<UpdateHomeDto> {
  constructor(@InjectModel("Home") private homeModel: Model<UpdateHomeDto>) {}

  async create(createHomeDto: CreateHomeDto): Promise<UpdateHomeDto> {
    const home = new this.homeModel(createHomeDto);
    return (await home.save()).toObject();
  }

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<UpdateHomeDto[]> {
    return await this.homeModel.find(this.getQuery(homeFilterDto)).lean();
  }

  async getById(id: string): Promise<UpdateHomeDto> {
    return (await (await this.homeModel.findById(id))?.populate("messages"))?.toObject();
  }

  async updateById(homeId: string, updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
    return this.homeModel.findByIdAndUpdate(homeId, updateHomeDto, { new: true }).lean(); // { new: true } Option will let us get the updated Home
  }

  async deleteById(homeId: string): Promise<UpdateHomeDto> {
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
export class HomeRepositoryPrisma implements IHomeRepository<Home> {
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
        propertyType: PropertyTypePrisma[createHomeDto.propertyType],
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

  async updateById(id: string, updateHomeDto: UpdateHomeDto): Promise<Home> {
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
        propertyType: PropertyTypePrisma[updateHomeDto.propertyType],
      },
    });
  }

  async deleteById(id: string): Promise<Home> {
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
