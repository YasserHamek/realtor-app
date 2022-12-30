import { Home, Message, User, UserType } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsString, IsEmail, IsNotEmpty, Matches, MinLength, IsOptional } from "class-validator";

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im, {
    message: "phoneNumber must be a valide phone number",
  })
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  productKey: string;
}

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class ProductKeyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

export class UserDto {
  constructor(user: User) {
    Object.assign(this, user);
  }

  id: number;

  name: string;

  phoneNumber: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  email: string;

  @Exclude()
  password: string;

  userType: UserType;

  homes?: Home[];

  buyerMessages?: Message[];

  realtorMessages?: Message[];
}

export interface UserTokenData {
  id: number;
  name: string;
  iat: string;
}
