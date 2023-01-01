import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HomeDocument = HydratedDocument<Home>;

@Schema()
export class Home {
  @Prop()
  adress: string;

  @Prop()
  numberOfBedrooms: number;

  @Prop()
  numberOfBathrooms: number;

  @Prop()
  city: string;

  @Prop()
  price: number;

  @Prop()
  landSize: number;

  @Prop()
  realtorId: number;

  // @Prop()
  // propertyType          PropertyType

  // @Prop()
  // realtor               User @relation(fields: [realtorId], references: [id], onDelete: Cascade)

  // @Prop()
  // createdAt             DateTime @default(now())

  // @Prop()
  // updatedAt             DateTime @updatedAt

  // @Prop()
  // images                Image[]

  // @Prop()
  // messages              Message[]
}

export const HomeSchema = SchemaFactory.createForClass(Home);
