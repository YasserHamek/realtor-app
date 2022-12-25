import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HomeModule } from "./home/home.module";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, //interceptor allows for exemple to use @Exclude() from class-transformer in dto
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
