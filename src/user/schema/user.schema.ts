import { Schema } from "mongoose";

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

// enable virtual to get id instead of _id
UserSchema.set("toObject", {
  virtuals: true,
});
