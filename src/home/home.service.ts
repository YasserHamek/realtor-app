import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Home } from "@prisma/client";
import { Model } from "mongoose";
import { PrismaService } from "../prisma/prisma.service";
import { UserTokenData } from "../user/user.dto";
import { CreateHomeDto, HomeFilterDto, MessageDto, UpdateHomeDto } from "./home.dto";
import { HomeRepository } from "./home.repository";
import { HomeDocument } from "./home.schema";

@Injectable()
export class HomeService {
  constructor(
    @InjectModel("Home") private homeModel: Model<HomeDocument>,
    private readonly homeRepository: HomeRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createHomeV2(createHomeDto: CreateHomeDto, id: number): Promise<HomeDocument> {
    const newHome = new this.homeModel(createHomeDto);
    return newHome.save();
  }

  /**
   * @deprecated use createHomeV2 instead
   */
  async createHome(createHomeDto: CreateHomeDto, id: number) {
    const createdHome: Home = await this.homeRepository.createHome(createHomeDto, id);

    this.homeRepository.createImages(
      createHomeDto.images.map(image => {
        return { url: image.url, homeId: createdHome.id };
      }),
    );

    return createdHome;
  }

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<UpdateHomeDto[]> {
    const homes: any[] = await this.prismaService.home.findMany({
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

    if (!homes || homes.length === 0) {
      throw new HttpException("No home is found with this filter", HttpStatus.NOT_FOUND);
    }

    return homes.map(home => new UpdateHomeDto(home));
  }

  async updateHomeById(id: number, updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
    const updatedHome: UpdateHomeDto = await this.prismaService.home.update({
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
    return new UpdateHomeDto(updatedHome);
  }

  async deleteHomeById(id: number): Promise<UpdateHomeDto> {
    const home = await this.prismaService.home.delete({
      where: {
        id: id,
      },
    });
    return new UpdateHomeDto(home);
  }

  async getHomeById(id: number): Promise<Home> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
    });
    return home;
  }

  async addMessage(homeId: number, buyer: UserTokenData, message: string): Promise<MessageDto> {
    const home = await this.getHomeById(homeId);

    const addedMessage = await this.prismaService.message.create({
      data: {
        message: message,
        buyerId: buyer.id,
        homeId: home.id,
        realtorId: home.realtorId,
      },
      include: {
        buyer: {
          select: {
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });

    return new MessageDto(addedMessage);
  }

  async getAllMessages(homeId: number): Promise<MessageDto[]> {
    const messages = await this.prismaService.message.findMany({
      where: {
        homeId,
      },
      include: {
        buyer: {
          select: {
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
    return messages.map(message => new MessageDto(message));
  }
}
