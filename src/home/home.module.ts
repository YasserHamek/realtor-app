import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { HomeController } from "./home.controller";
import { HomeSchema } from "./home.schema";
import { HomeService } from "./home.service";
import { HomeRepositoryPrisma } from "./repository/home.repository";
import { ImageRepository } from "./repository/image.repository";
import { MessageRepository } from "./repository/message.repository";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Home", schema: HomeSchema }]), PrismaModule, UserModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: "IHomeRepository",
      useClass: HomeRepositoryPrisma,
    },
    {
      provide: "IMessageRepository",
      useClass: MessageRepository,
    },
    {
      provide: "IImageRepository",
      useClass: ImageRepository,
    },
  ],
})
export class HomeModule {}
