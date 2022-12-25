import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { PropertyType } from "@prisma/client";
import { CreateHomeDto, HomeFilterDto, HomeResponseDto } from "./home.dto";
import { HomeService } from "./home.service";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto) {
    return this.homeService.createHome(createHomeDto);
  }

  @Get()
  getAllHomes(
    @Query("city") city: string,
    @Query("propertyType") propertyType: PropertyType,
    @Query("minPrice") minPrice: string,
    @Query("maxPrice") maxPrice: string,
  ): Promise<HomeResponseDto[]> {
    console.log("____ _ _ minPrice : ", minPrice, " typeOf(minPrice)", typeof minPrice);
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const homeFilterDto: HomeFilterDto = {
      ...(city && { city }),
      ...(propertyType && { propertyType }),
      ...(price && { price }),
    };
    console.log("____ _ _ _homeFilterDto : ", homeFilterDto);
    return this.homeService.getAllHomesByFilter(homeFilterDto);
  }
}
