import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HomeModule } from "./home/home.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { tokenIterceptor } from "./interceptors/token.interceptor";

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, //interceptor allows for exemple to use @Exclude() from class-transformer in dto
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: tokenIterceptor, //intercept request and retrieve user from token then add it into request
    },
  ],
})
export class AppModule {}
