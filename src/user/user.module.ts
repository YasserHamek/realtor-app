import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth/controller/auth.controller";
import { AuthService } from "./auth/service/auth.service";
import { UserSchema } from "./auth/schema/user.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }]), PrismaModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
