import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth/controller/auth.controller";
import { AuthService } from "./auth/service/auth.service";
import { UserSchema } from "./auth/schema/user.schema";
import { userRepositoryMongoDb } from "./auth/repository/user.repository";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }]), PrismaModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: "UserRepository",
      useClass: userRepositoryMongoDb,
    },
  ],
})
export class UserModule {}
