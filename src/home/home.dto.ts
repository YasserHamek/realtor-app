import { PropertyType } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "../user/user.dto";

export class CreateHomeDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  adress: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images?: Image[];

  @IsNumber()
  @IsPositive()
  @IsOptional()
  realtorId?: number;
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  homeId: number;
}

export class UpdateHomeDto extends PartialType(CreateHomeDto) {
  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  constructor(updateHomeDto: Partial<UpdateHomeDto>) {
    super();
    Object.assign(this, updateHomeDto);
  }
}

export class ResponseImageDto extends PartialType(Image) {}

export class HomeFilterDto {
  city?: string;
  propertyType?: PropertyType;
  price?: {
    gte?: number;
    lte?: number;
  };
}

export class MessageDto {
  constructor(messageDto: MessageDto) {
    Object.assign(this, messageDto);
  }

  id?: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsPositive()
  buyerId: number;

  @IsOptional()
  buyer?: Partial<UserDto>;

  @IsNumber()
  @IsPositive()
  realtorId: number;

  @IsOptional()
  realtor?: UserDto;

  @IsNumber()
  @IsPositive()
  homeId: number;

  @IsOptional()
  home?: CreateHomeDto;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;
}
