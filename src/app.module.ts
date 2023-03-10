import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HomeModule } from "./home/home.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { getEnvPath } from "./common/helper/env.helper";
import { MongooseModule } from "@nestjs/mongoose";

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_DATABASE_URL),
    UserModule,
    PrismaModule,
    HomeModule,
  ],
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
