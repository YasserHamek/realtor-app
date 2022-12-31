import { ConflictException, HttpException, HttpStatus, Injectable, UseGuards } from "@nestjs/common";
import { ProductKeyDto, SignInUserDto, SignUpUserDto, UserDto } from "../user.dto";
import * as bcrypt from "bcryptjs";
import { User, UserType } from "@prisma/client";
import { JwtUtils } from "./JwtUtils";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUpUser(createUserDto: SignUpUserDto, userType: UserType) {
    //Checking if user want to signUp as REALTOR, if true, we check if he have a valid productKey
    const productKey = `${createUserDto.email}-${createUserDto.name}-${process.env.PRODUCT_KEY_SIGNITURE}`;
    if (userType === UserType.REALTOR && (!createUserDto.productKey || !bcrypt.compare(createUserDto.productKey, productKey))) {
      throw new HttpException(
        "To signup as REALTOR, you must give a valid productKey, please contact you admin to get a productKey",
        HttpStatus.UNAUTHORIZED,
      );
    }

    //checking if email is used
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new ConflictException("email adress is already used, please use another email adress");
    }

    //hashing the password
    const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10);

    //creating the user
    const createdUser: User = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        phoneNumber: createUserDto.phoneNumber,
        userType: userType,
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

    if (!user || !bcrypt.compare(signInUserDto.password, user ? user.password : ""))
      throw new HttpException("Email or Password are incorrect", HttpStatus.BAD_REQUEST);

    return JwtUtils.createJsonWebToken(user.id, user.name);
  }

  async generateProductKeyDto(productKeyDto: ProductKeyDto): Promise<string> {
    const key = `${productKeyDto.email}-${productKeyDto.name}-${process.env.PRODUCT_KEY_SIGNITURE}`;
    return await bcrypt.hash(key, 10);
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    return new UserDto(user);
  }
}
