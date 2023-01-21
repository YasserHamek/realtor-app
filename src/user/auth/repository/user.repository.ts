import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { User } from "@prisma/client";
import { GenericRepository } from "../../../common/generic/repository/generic.repository.interface";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserDto } from "../service/user.dto";

export interface IUserRepository<R> extends GenericRepository<UserDto, R> {
  findByEmail(email: string): Promise<R>;
}

@Injectable()
export class userRepositoryMongoDb implements IUserRepository<UserDto> {
  async findByEmail(email: string): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }

  async create(userDto: UserDto): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }

  async getById(id: string): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }

  async updateById(id: string, userDto: Partial<UserDto>): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: string): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }
}

@Injectable()
export class userRepositoryPrisma implements IUserRepository<UserDto> {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    return new UserDto(user);
  }

  async create(userDto: UserDto): Promise<UserDto> {
    const createdUser: User = await this.prismaService.user.create({
      data: {
        name: userDto.name,
        email: userDto.email,
        password: userDto.password,
        phoneNumber: userDto.phoneNumber,
        userType: userDto.userType,
      },
    });

    return new UserDto(createdUser);
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return new UserDto(user);
  }

  async updateById(id: string, userDto: Partial<UserDto>): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }

  async deleteById(id: string): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }
}
