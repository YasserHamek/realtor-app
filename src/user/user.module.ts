import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./controller/user.controller";
import { AuthService } from "./service/user.service";
import { UserSchema } from "./schema/user.schema";
import { userRepositoryMongoDb } from "./repository/user.repository";

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
