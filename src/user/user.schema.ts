import { HydratedDocument, Schema } from "mongoose";

// export type HomeDocument = HydratedDocument<typeof UserSchema>;

export const UserSchema = new Schema(
  {
    name: String,

    phoneNumber: String,

    email: String,

    password: String,

    userType: {
      type: String,
      enum: ["BUYER", "REALTOR", "ADMIN"],
    },

    homes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Home",
      },
    ],

    Messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true },
);

// export class User {
//   name: string;

//   phoneNumber: string;

//   email: string;

//   password: string;

//   // userType              UserType
//   // homes                 Home[]
//   // buyerMessages         Message[] @relation("BuyerMessage")
//   // realtorMessages       Message[] @relation("RealtorMessage")
//   // createdAt             DateTime  @default(now())
//   // updatedAt             DateTime  @updatedAt
// }
