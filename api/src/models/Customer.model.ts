import { Document, Schema, model } from "mongoose";

export interface CustomerDocument extends Document {
  name: string;
  address: string;
  mobile: number;
}

const CutomerSchema = new Schema<CustomerDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const CustomerModel = model<CustomerDocument>('Customer', CutomerSchema);