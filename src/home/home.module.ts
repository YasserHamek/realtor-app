import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
