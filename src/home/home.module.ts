import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { HomeController } from "./controller/home.controller";
import { HomeSchema, MessageSchema } from "./schema/home.schema";
import { HomeService } from "./service/home.service";
import { HomeRepositoryMongoDb } from "./repository/home.repository";
import { ImageRepository } from "./repository/image.repository";
import { MessageRepositoryMongoDb } from "./repository/message.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Home", schema: HomeSchema },
      { name: "Message", schema: MessageSchema },
    ]),
    PrismaModule,
    UserModule,
  ],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: "IHomeRepository",
      useClass: HomeRepositoryMongoDb,
    },
    {
      provide: "IMessageRepository",
      useClass: MessageRepositoryMongoDb,
    },
    {
      provide: "IImageRepository",
      useClass: ImageRepository,
    },
  ],
})
export class HomeModule {}
