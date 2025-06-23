import { Document, Schema, model } from "mongoose";

export interface ItemDocument extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const ItemSchema = new Schema<ItemDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export const ItemModel = model<ItemDocument>('Item', ItemSchema);