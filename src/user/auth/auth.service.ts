import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
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
    return jwt.sign(
      {
        name: createdUser.name,
        id: createdUser.id,
      },
      process.env.JSON_WEB_TOKEN_KEY,
    );
  }
}
