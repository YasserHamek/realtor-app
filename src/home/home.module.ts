import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
