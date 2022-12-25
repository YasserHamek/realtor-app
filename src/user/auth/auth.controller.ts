import { Body, Controller, ParseEnumPipe, Post } from "@nestjs/common";
import { Param } from "@nestjs/common/decorators";
import { UserType } from "@prisma/client";
import { ProductKeyDto, SignInUserDto, SignUpUserDto } from "../user.dto";
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
  @Post("key")
  generateProductKey(@Body() productKeyDto: ProductKeyDto): Promise<string> {
    return this.authService.generateProductKeyDto(productKeyDto);
  }
}
