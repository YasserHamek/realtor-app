import { PropertyType } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
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
  images?: Image[];
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
