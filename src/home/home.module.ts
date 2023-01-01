import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { HomeController } from "./home.controller";
import { HomeSchema } from "./home.schema";
import { HomeService } from "./home.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Home", schema: HomeSchema }]), PrismaModule, UserModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
