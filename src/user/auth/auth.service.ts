import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    //checking if email is used
    const email = createUserDto.email;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      throw new ConflictException(
        'email adress is already used, please use another email adress',
      );
    }
    return null;
  }
}
