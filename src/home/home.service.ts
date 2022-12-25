import { Injectable } from '@nestjs/common';
import { Home } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto } from './home.dto';

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
      console.log('____ _ _ _ image : ', image);
      return { url: image.url, homeId: createdHome.id };
    });

    this.prismaService.image
      .createMany({
        data: images,
      })
      .then();

    return createdHome;
  }
}
