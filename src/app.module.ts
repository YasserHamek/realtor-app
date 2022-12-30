import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HomeModule } from "./home/home.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuards } from "./guards/roles.guard";
import { AuthService } from "./user/auth/auth.service";

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, //interceptor allows for exemple to use @Exclude() from class-transformer in dto
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: tokenIterceptor, //intercept request and retrieve user from token then add it into request
    // },
  ],
})
export class AppModule {}
