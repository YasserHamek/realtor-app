import { Schema } from "mongoose";

export const ImageSchema = new Schema({
  url: String,
});

ImageSchema.set("toObject", {
  virtuals: true,
});

export const HomeSchema = new Schema(
  {
    adress: String,

    numberOfBedrooms: Number,

    numberOfBathrooms: Number,

    city: String,

    price: Number,

    landSize: Number,

    propertyType: {
      type: String,
      enum: ["RESIDENTIAL", "CONDO"],
    },

    // images will be nested subdocument
    images: [ImageSchema],

    realtor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true, // this will add createdAt and updatedAt automatically
  },
);

HomeSchema.set("toObject", {
  virtuals: true,
});

export const MessageSchema = new Schema(
  {
    message: String,

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    home: {
      type: Schema.Types.ObjectId,
      ref: "Home",
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.set("toObject", {
  virtuals: true,
});
