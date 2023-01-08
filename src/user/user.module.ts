import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { UserSchema } from "./user.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }]), PrismaModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
