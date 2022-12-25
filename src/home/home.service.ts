import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Home } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "./home.dto";

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

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<UpdateHomeDto[]> {
    const homes = await this.prismaService.home.findMany({
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
}
