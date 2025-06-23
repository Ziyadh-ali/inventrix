import { Document, model, ObjectId, Schema, Types } from "mongoose";


export interface SaleDocument extends Document {
    _id: ObjectId | string
    date: Date,
    items: {
        name: string,
        quantity: number,
        price: number;
    }[],
    customerName: string;
}

const SaleSchema = new Schema<SaleDocument>(
    {
        date: {
            type: Date,
            required: true,
        },
        items: [{
            name: {
                type: String,
            },
            quantity : String,
            price : Number,
        }],
        customerName: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export const SaleModel = model<SaleDocument>("Sale", SaleSchema);