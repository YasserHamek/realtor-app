import { Body, Controller, Post, Get, Query, Put, Param } from "@nestjs/common";
import { Delete, UseGuards } from "@nestjs/common/decorators";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { Roles } from "../../common/decorators/roles.decorator";
import { User } from "../../common/decorators/user.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuards } from "../../common/guards/roles.guard";
import { UserTokenData, UserType } from "../../user/auth/service/user.dto";
import { CreateHomeDto, HomeFilterDto, MessageDto, PropertyType, UpdateHomeDto } from "./home.dto";
import { HomeService } from "../service/home.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PropertyType as PropertyTypePrisma } from "@prisma/client";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService, @InjectModel("Home") private homeModel: Model<UpdateHomeDto>) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async createHome(@Body() createHomeDto: CreateHomeDto, @User() user: UserTokenData) {
    createHomeDto.realtorId = user.id;
    return await this.homeService.createHome(createHomeDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllHomes(
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
      ...(propertyType && { propertyType: PropertyTypePrisma[propertyType] }),
      ...(price && { price }),
    };

    return this.homeService.getAllHomesByFilter(homeFilterDto);
  }

  @Get(":homeId")
  @UseGuards(AuthGuard)
  async getHomeById(@Param("homeId") homeId: string): Promise<UpdateHomeDto> {
    return this.homeService.getHomeById(homeId);
  }

  @Put(":homeId")
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async updateHomeById(
    @Param("homeId") homeId: string,
    @Body() updateHomeDto: UpdateHomeDto,
    @User() user: UserTokenData,
  ): Promise<UpdateHomeDto> {
    return this.homeService.updateHomeById(homeId, updateHomeDto, user);
  }

  @Delete(":homeId")
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async deleteHomeById(@Param("homeId") homeId: string, @User() user: UserTokenData): Promise<UpdateHomeDto> {
    return this.homeService.deleteHomeById(homeId, user);
  }

  @Post(":homeId/inquire")
  @Roles(UserType.BUYER)
  @UseGuards(AuthGuard, RolesGuards)
  async inquire(@Param("homeId") homeId: string, @User() user: UserTokenData, @Body() { message }): Promise<MessageDto> {
    return await this.homeService.addMessage(homeId, user, message);
  }

  @Get(":homeId/messages")
  @Roles(UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async getAllHomeMessages(@Param("homeId") homeId: string, @User() user: UserTokenData): Promise<MessageDto[]> {
    const home: UpdateHomeDto = await this.homeService.getHomeById(homeId);

    if (home.realtorId != user.id)
      throw new UnauthorizedException("Anauthorized Delete, you must be the realtor associated with this home to delete it.");

    return this.homeService.getAllMessages(homeId);
  }
}
