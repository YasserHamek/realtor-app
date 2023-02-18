import { Body, Controller, Post, Get, Query, Put, Param } from "@nestjs/common";
import { Delete, UseGuards } from "@nestjs/common/decorators";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { Roles } from "../../common/decorators/roles.decorator";
import { User } from "../../common/decorators/user.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuards } from "../../common/guards/roles.guard";
import { UserTokenData, UserType } from "../../user/controller/user.dto";
import { CreateHomeDto, HomeFilterDto, MessageDto, PropertyType, UpdateHomeDto } from "./home.dto";
import { HomeService } from "../service/home.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PropertyType as PropertyTypePrisma } from "@prisma/client";
import { ApiCreatedResponse, ApiFoundResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("home")
@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService, @InjectModel("Home") private homeModel: Model<UpdateHomeDto>) {}

  @Post()
  @ApiCreatedResponse({ type: UpdateHomeDto, description: "The home has been created successfully." })
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async createHome(@Body() createHomeDto: CreateHomeDto, @User() user: UserTokenData): Promise<UpdateHomeDto> {
    createHomeDto.realtor = { _id: new Types.ObjectId(user.id) };
    return await this.homeService.createHome(createHomeDto);
  }

  @Get()
  @ApiFoundResponse({ type: UpdateHomeDto, isArray: true, description: "Homes mathiching the filter has been found." })
  @ApiParam({ name: "city", description: "Home city search filter." })
  @ApiParam({ name: "propertyType", description: "Home type searching filter, either Cando or Residential." })
  @ApiParam({ name: "minPrice", description: "Home minimal price searching filter." })
  @ApiParam({ name: "maxPrice", description: "Home maximal price searching filter." })
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
  @ApiFoundResponse({ type: UpdateHomeDto, description: "The home has been found successfully." })
  @ApiParam({ name: "homeId", description: "Home id." })
  @UseGuards(AuthGuard)
  async getHomeById(@Param("homeId") homeId: string): Promise<UpdateHomeDto> {
    return this.homeService.getHomeById(homeId);
  }

  @Put(":homeId")
  @ApiOkResponse({ type: UpdateHomeDto, description: "Home has been updated successfully." })
  @ApiParam({ name: "homeId", description: "Home id." })
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
  @ApiOkResponse({ type: UpdateHomeDto, description: "Home has been deleted successfully." })
  @ApiParam({ name: "homeId", description: "Home id." })
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async deleteHomeById(@Param("homeId") homeId: string, @User() user: UserTokenData): Promise<UpdateHomeDto> {
    return this.homeService.deleteHomeById(homeId, user);
  }

  @Post(":homeId/inquire")
  @ApiFoundResponse({ type: UpdateHomeDto, description: "Home has been found." })
  @ApiParam({ name: "homeId", description: "Home id." })
  @Roles(UserType.BUYER, UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard, RolesGuards)
  async inquire(@Param("homeId") homeId: string, @User() user: UserTokenData, @Body() { message }): Promise<MessageDto> {
    return await this.homeService.addMessage(homeId, user, message);
  }

  @Get(":homeId/messages")
  @ApiFoundResponse({ type: MessageDto, isArray: true, description: "Messages has been found." })
  @ApiParam({ name: "homeId", description: "Home id." })
  @Roles(UserType.REALTOR, UserType.ADMIN)
  @UseGuards(AuthGuard, RolesGuards)
  async getAllHomeMessages(@Param("homeId") homeId: string, @User() user: UserTokenData): Promise<MessageDto[]> {
    return this.homeService.getAllMessages(homeId, user);
  }
}
