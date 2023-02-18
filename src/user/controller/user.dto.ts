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
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum UserType {
  BUYER = "BUYER",
  REALTOR = "REALTOR",
  ADMIN = "ADMIN",
}

export class SignUpUserDto {
  @ApiProperty({ description: "User name." })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "User phone number." })
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im, {
    message: "phoneNumber must be a valide phone number",
  })
  phoneNumber: string;

  @ApiProperty({ description: "User email adress." })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User password." })
  @IsString()
  @MinLength(5)
  password: string;

  @ApiPropertyOptional({ description: "productKey given by Admin to create Realtor user." })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  productKey: string;
}

export class SignInUserDto {
  @ApiProperty({ description: "User email adress." })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User password." })
  @IsString()
  @MinLength(5)
  password: string;
}

export class ProductKeyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "User email adress." })
  @IsEmail()
  email: string;
}

export class UserDto {
  constructor(user: any) {
    Object.assign(this, user);
  }

  @ApiProperty({ description: "mongoDb user id." })
  @Exclude()
  _id?: object;

  @ApiPropertyOptional({ description: "posgreSQL user id." })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Exclude()
  id?: string;

  @ApiProperty({ description: "User name." })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "User phone number." })
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im, {
    message: "phoneNumber must be a valide phone number",
  })
  phoneNumber: string;

  @ApiProperty({ description: "Creation date." })
  @Exclude()
  createdAt?: Date;

  @ApiProperty({ description: "Updating date." })
  @Exclude()
  updatedAt?: Date;

  @ApiProperty({ description: "User email adress." })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User password." })
  @Exclude()
  password: string;

  @ApiProperty({ description: "User Type : Buyer, Realtor, Admin." })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({ description: "Homes associed with the user." })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateHomeDto)
  @IsOptional()
  homes?: UpdateHomeDto[];

  @ApiPropertyOptional({ description: "Messages associed with the user." })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @IsOptional()
  buyerMessages?: MessageDto[];

  @ApiPropertyOptional({ description: "Messages associed with the user." })
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

  @ApiProperty({ description: "User id." })
  id: string;

  @ApiProperty({ description: "User name." })
  name: string;

  @ApiProperty()
  iat: string;
}
