import { Body, Controller, ParseEnumPipe, Post } from "@nestjs/common";
import { Get, Param, UseGuards } from "@nestjs/common/decorators";
import { UserType } from "@prisma/client";
import { Roles } from "../../decorators/roles.decorator";
import { User } from "../../decorators/user.decorator";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuards } from "../../guards/roles.guard";
import { ProductKeyDto, SignInUserDto, SignUpUserDto, UserDto, UserTokenData } from "../user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup/:userType")
  singUp(
    @Param("userType", new ParseEnumPipe(UserType)) userType: UserType,
    @Body() createUserDto: SignUpUserDto,
  ): Promise<string> {
    return this.authService.signUpUser(createUserDto, userType);
  }

  @Post("signin")
  singIn(@Body() signInUserDto: SignInUserDto): Promise<string> {
    return this.authService.signInUser(signInUserDto);
  }

  //We give the key to user for signing up as REALTOR
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, RolesGuards)
  @Post("key")
  generateProductKey(@Body() productKeyDto: ProductKeyDto): Promise<string> {
    return this.authService.generateProductKeyDto(productKeyDto);
  }

  @UseGuards(AuthGuard)
  @Get("currentUserInfo")
  async getCurrentUserInfo(@User() user: UserTokenData): Promise<UserDto> {
    return await this.authService.getUserById(user.id);
  }
}
