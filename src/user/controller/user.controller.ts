import { Body, Controller, ParseEnumPipe, Post } from "@nestjs/common";
import { Get, Param, UseGuards } from "@nestjs/common/decorators";
import { Roles } from "../../common/decorators/roles.decorator";
import { User } from "../../common/decorators/user.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuards } from "../../common/guards/roles.guard";
import { ProductKeyDto, SignInUserDto, SignUpUserDto, UserDto, UserTokenData, UserType } from "./user.dto";
import { AuthService } from "../service/user.service";
import { ApiTags, ApiParam, ApiFoundResponse, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";

@ApiTags("user")
@Controller("user")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup/:userType")
  @ApiCreatedResponse({ description: "SignUp has been successfull." })
  @ApiParam({
    name: "userType",
    description: "User Type, either a BUYER, REALTOR, or an ADMIN",
  })
  singUp(
    @Param("userType", new ParseEnumPipe(UserType)) userType: UserType,
    @Body() createUserDto: SignUpUserDto,
  ): Promise<string> {
    return this.authService.signUpUser(createUserDto, userType);
  }

  @Post("signin")
  @ApiOkResponse({ description: "SignIn has been successfull." })
  singIn(@Body() signInUserDto: SignInUserDto): Promise<string> {
    return this.authService.signInUser(signInUserDto);
  }

  //We give the key to user for signing up as REALTOR
  @Post("key")
  @ApiOkResponse({ description: "ProductKey has been generated successfully." })
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard, RolesGuards)
  generateProductKey(@Body() productKeyDto: ProductKeyDto): Promise<string> {
    return this.authService.generateProductKeyDto(productKeyDto);
  }

  @Get("currentUserInfo")
  @ApiFoundResponse({ type: UserDto, description: "Getting current user information has been successfully." })
  @UseGuards(AuthGuard)
  async getCurrentUserInfo(@User() user: UserTokenData): Promise<UserDto> {
    return await this.authService.getUserById(user.id);
  }
}
