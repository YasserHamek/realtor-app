import { HydratedDocument, Schema } from "mongoose";

export type HomeDocument = HydratedDocument<IHome>;

export type MessageDocument = HydratedDocument<typeof MessageSchema>;

export const HomeSchema = new Schema(
  {
    adress: String,

    numberOfBedrooms: Number,

    numberOfBathrooms: Number,

    city: String,

    price: Number,

    landSize: Number,

    realtorId: Number,

    propertyType: {
      type: String,
      enum: ["RESIDENTIAL", "CONDO"],
    },

    // images: [
    //   {
    //     url: String,
    //   },
    // ],

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
    timestamps: true, // this will add createdAt and updatedAt automatically
  },
);

export interface IHome {
  readonly adress: string;

  readonly numberOfBedrooms: number;

  readonly numberOfBathrooms: number;

  readonly city: string;

  readonly price: number;

  readonly landSize: number;

  readonly realtorId: number;

  readonly propertyType: {
    type: string;
    enum: ["RESIDENTIAL", "CONDO"];
  };

  readonly realtor: {
    type: Schema.Types.ObjectId;
    ref: "User";
  };

  readonly images: [
    {
      url: string;
    },
  ];

  messages: [
    {
      type: Schema.Types.ObjectId;
      ref: "Message";
    },
  ];

  // @Prop()
  // createdAt             DateTime @default(now())

  // @Prop()
  // updatedAt             DateTime @updatedAt
}
