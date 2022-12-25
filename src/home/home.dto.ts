import { PropertyType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateHomeDto {
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
  images: Image[];
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  homeId?: number;
}

export class HomeResponseDto extends PartialType(CreateHomeDto) {}

export class ResponseImageDto extends PartialType(Image) {}
