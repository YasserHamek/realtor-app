import { Body, Controller, Post, Get } from "@nestjs/common";
import { Home } from "@prisma/client";
import { CreateHomeDto, HomeResponseDto } from "./home.dto";
import { HomeService } from "./home.service";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto) {
    return this.homeService.createHome(createHomeDto);
  }

  @Get()
  getAllHomes(): Promise<HomeResponseDto[]> {
    return this.homeService.getAllHomes();
  }
}
