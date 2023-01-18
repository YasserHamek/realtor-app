import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "../../user/user.dto";

export class CreateHomeDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Exclude()
  id?: number;

  @IsNotEmpty()
  @IsOptional()
  @Exclude()
  _id?: object;

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
  @IsOptional()
  images?: Image[];

  @IsNumber()
  @IsPositive()
  @IsOptional()
  realtorId?: number;

  constructor(createHomeDto: Partial<CreateHomeDto>) {
    Object.assign(this, createHomeDto);
  }
}

export class Image {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Exclude()
  id?: number;

  @IsNotEmpty()
  @IsOptional()
  @Exclude()
  _id?: object;

  @IsString()
  @IsNotEmpty()
  url: string;

  @Expose({ name: "id" })
  getImageId?() {
    return this._id ? this._id.valueOf() : this.id;
  }

  constructor(image: Partial<Image>) {
    Object.assign(this, image);
  }
}

export class UpdateHomeDto extends PartialType(CreateHomeDto) {
  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  @Expose({ name: "id" })
  getHomeId?() {
    return this._id ? this._id.valueOf() : this.id;
  }

  @Expose({ name: "images" })
  getImages?() {
    return this.images?.map(image => {
      return new Image(image);
    });
  }

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
