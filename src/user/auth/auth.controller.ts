import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singUp(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.createUser(createUserDto);
  }
}
