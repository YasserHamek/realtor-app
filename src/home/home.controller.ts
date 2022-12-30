import { Body, Controller, Post, Get, Query, Put, Param, ParseIntPipe } from "@nestjs/common";
import { Delete } from "@nestjs/common/decorators";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { Home, PropertyType, UserType } from "@prisma/client";
import { Roles } from "src/decorators/roles.decorator";
import { User } from "src/decorators/user.decorator";
import { UserTokenData } from "src/user/user.dto";
import { CreateHomeDto, HomeFilterDto, UpdateHomeDto } from "./home.dto";
import { HomeService } from "./home.service";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto, @User() user: UserTokenData) {
    return this.homeService.createHome(createHomeDto, user.id);
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

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Put(":id")
  async updateHomeById(
    @Param("id", new ParseIntPipe()) id: number,
    @Body() updateHomeDto: UpdateHomeDto,
    @User() user: UserTokenData,
  ): Promise<UpdateHomeDto> {
    const home: Home = await this.homeService.getHomeById(id);

    if (home.realtorId != user.id)
      throw new UnauthorizedException("Anauthorized Update, you must be the realtor home to update it.");

    return this.homeService.updateHomeById(id, updateHomeDto);
  }

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Delete(":id")
  async deleteHomeById(@Param("id", new ParseIntPipe()) id: number, @User() user: UserTokenData): Promise<UpdateHomeDto> {
    const home: Home = await this.homeService.getHomeById(id);

    if (home.realtorId != user.id)
      throw new UnauthorizedException("Anauthorized Delete, you must be the realtor home to delete it.");

    return this.homeService.deleteHomeById(id);
  }
}
