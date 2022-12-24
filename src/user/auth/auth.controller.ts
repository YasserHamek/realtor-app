import { Body, Controller, Post } from '@nestjs/common';
import { SignInUserDto, SignUpUserDto } from '../user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singUp(@Body() createUserDto: SignUpUserDto): Promise<string> {
    return this.authService.signUpUser(createUserDto);
  }

  @Post('signin')
  singIn(@Body() signInUserDto: SignInUserDto): Promise<string> {
    return this.authService.signInUser(signInUserDto);
  }
}
