import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "../../user/controller/user.dto";
import { PropertyType as PropertyTypePrisma } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum PropertyType {
  RESIDENTIAL,
  CONDO,
}

export class CreateHomeDto {
  @ApiPropertyOptional({ description: "posgreSQL user id." })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id?: number;

  @ApiProperty({ description: "mongoDb user id." })
  @Exclude()
  _id?: object;

  @ApiProperty({ description: "Home adress." })
  @IsString()
  @IsNotEmpty()
  adress: string;

  @ApiProperty({ description: "Home bedrooms number." })
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @ApiProperty({ description: "Home bathrooms number." })
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @ApiProperty({ description: "Home city." })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: "Home price." })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: "Home land size." })
  @IsNumber()
  @IsPositive()
  landSize: number;

  @ApiProperty({ description: "Home type, either Cando or Residential." })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiPropertyOptional({ description: "Home associated images." })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto[];

  @ApiPropertyOptional({ description: "Home associated realtor." })
  @IsOptional()
  realtor?: Partial<UserDto>;

  constructor(createHomeDto: Partial<CreateHomeDto>) {
    Object.assign(this, createHomeDto);
  }
}

export class ImageDto {
  @ApiPropertyOptional({ description: "posgreSQL image id." })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({ description: "mongoDb Image id." })
  @IsNotEmpty()
  @IsOptional()
  @Exclude()
  _id?: object;

  @ApiProperty({ description: "Image url." })
  @IsString()
  @IsNotEmpty()
  url: string;

  constructor(image: Partial<ImageDto>) {
    Object.assign(this, image);
  }
}

export class UpdateHomeDto extends PartialType(CreateHomeDto) {
  @ApiProperty({ description: "Home associated messages." })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @IsOptional()
  messages?: MessageDto[];

  @ApiProperty({ description: "Home creation date." })
  @Exclude()
  createdAt?: Date;

  @ApiProperty({ description: "Home updating date." })
  @Exclude()
  updatedAt?: Date;

  @Expose({ name: "images" })
  getImages?() {
    return this.images?.map(image => {
      return new ImageDto(image);
    });
  }

  constructor(updateHomeDto: Partial<UpdateHomeDto>) {
    super();
    Object.assign(this, updateHomeDto);
  }
}

export class ResponseImageDto extends PartialType(ImageDto) {}

export class HomeFilterDto {
  @ApiProperty({ description: "Home ctiy searhing filter." })
  city?: string;

  @ApiProperty({ description: "Home type searching filter, either Cando or Residential." })
  propertyType?: PropertyTypePrisma;

  @ApiProperty({ description: "Home minimal and maximal price searching filter." })
  price?: {
    gte?: number;
    lte?: number;
  };
}

export class MessageDto {
  constructor(messageDto: Partial<MessageDto>) {
    Object.assign(this, messageDto);
  }

  @ApiPropertyOptional({ description: "posgreSQL Message id." })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id?: number;

  @ApiProperty({ description: "mongoDb Message id." })
  @Exclude()
  _id?: object;

  @ApiProperty({ description: "Message content." })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: "Sender user id." })
  @IsNumber()
  @IsPositive()
  senderId?: string;

  @ApiPropertyOptional({ description: "Sender user." })
  @IsOptional()
  sender?: Partial<UserDto>;

  @ApiProperty({ description: "Reciever user id." })
  @IsNumber()
  @IsPositive()
  receiverId?: string;

  @ApiPropertyOptional({ description: "Reciever user." })
  @IsOptional()
  receiver?: Partial<UserDto>;

  @ApiProperty({ description: "Associated Home id." })
  @IsNumber()
  @IsPositive()
  homeId?: string;

  @ApiPropertyOptional({ description: "Associated Home." })
  @IsOptional()
  home?: UpdateHomeDto;

  @ApiProperty({ description: "Message creation date." })
  @Exclude()
  createdAt?: Date;

  @ApiProperty({ description: "Message updating date." })
  @Exclude()
  updatedAt?: Date;
}
