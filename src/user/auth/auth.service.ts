import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInUserDto, SignUpUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import { User, UserType } from '@prisma/client';
import { JwtUtils } from './JwtUtils';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUpUser(createUserDto: SignUpUserDto) {
    //checking if email is used
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new ConflictException(
        'email adress is already used, please use another email adress',
      );
    }

    //hashing the password
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    //creating the user
    const createdUser: User = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        phoneNumber: createUserDto.phoneNumber,
        userType: UserType.BUYER,
      },
    });

    //returning JsonWebToken
    return JwtUtils.createJsonWebToken(createdUser.id, createdUser.name);
  }

  async signInUser(signInUserDto: SignInUserDto): Promise<string> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        email: signInUserDto.email,
      },
    });

    if (
      !user ||
      !bcrypt.compare(signInUserDto.password, user ? user.password : '')
    )
      throw new HttpException(
        'Email or Password are incorrect',
        HttpStatus.BAD_REQUEST,
      );

    return JwtUtils.createJsonWebToken(user.id, user.name);
  }
}
