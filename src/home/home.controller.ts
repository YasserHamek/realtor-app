import { Body, Controller, Post, Get, Query, Put, Param, ParseIntPipe } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { PropertyType } from "@prisma/client";
import { CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "./home.dto";
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
  ): Promise<UpdateHomeDto[]> {
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

    return this.homeService.getAllHomesByFilter(homeFilterDto);
  }

  @Put(":id")
  updateHomeById(@Param("id", new ParseIntPipe()) id: number, @Body() updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
    return this.homeService.updateHomeById(id, updateHomeDto);
  }

  @Delete(":id")
  deleteHomeById(@Param("id", new ParseIntPipe()) id: number): Promise<UpdateHomeDto> {
    return this.homeService.deleteHomeById(id);
  }
}
