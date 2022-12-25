import { Injectable } from "@nestjs/common";
import { Home } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateHomeDto, HomeResponseDto } from "./home.dto";

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createHome(createHomeDto: CreateHomeDto) {
    const createdHome: Home = await this.prismaService.home.create({
      data: {
        adress: createHomeDto.adress,
        city: createHomeDto.city,
        landSize: createHomeDto.landSize,
        numberOfBathrooms: createHomeDto.numberOfBathrooms,
        numberOfBedrooms: createHomeDto.numberOfBedrooms,
        price: createHomeDto.price,
        propertyType: createHomeDto.propertyType,
      },
    });

    const images = createHomeDto.images.map(image => {
      return { url: image.url, homeId: createdHome.id };
    });

    this.prismaService.image
      .createMany({
        data: images,
      })
      .then();

    return createdHome;
  }

  async getAllHomes(): Promise<HomeResponseDto[]> {
    const homes: HomeResponseDto[] = await this.prismaService.home.findMany({
      select: {
        adress: true,
        city: true,
        id: true,
        landSize: true,
        numberOfBathrooms: true,
        numberOfBedrooms: true,
        price: true,
        propertyType: true,
        images: {
          select: {
            url: true,
            id: true,
          },
        },
      },
    });
    return homes;
  }
}
