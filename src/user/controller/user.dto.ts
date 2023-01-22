import { Exclude, Type } from "class-transformer";
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsArray,
  ValidateNested,
} from "class-validator";
import { MessageDto, UpdateHomeDto } from "../../home/controller/home.dto";

export enum UserType {
  BUYER = "BUYER",
  REALTOR = "REALTOR",
  ADMIN = "ADMIN",
}

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
  constructor(user: any) {
    Object.assign(this, user);
  }

  @Exclude()
  _id?: object;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Exclude()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im, {
    message: "phoneNumber must be a valide phone number",
  })
  phoneNumber: string;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  @IsEmail()
  email: string;

  @Exclude()
  password: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateHomeDto)
  @IsOptional()
  homes?: UpdateHomeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @IsOptional()
  buyerMessages?: MessageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @IsOptional()
  realtorMessages?: MessageDto[];
}

export class UserTokenData {
  constructor(userTokenData) {
    Object.assign(this, userTokenData);
  }

  id: string;
  name: string;
  iat: string;
}
