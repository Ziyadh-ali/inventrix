import { Document, model, Schema, Types } from "mongoose";


export interface UserDocument extends Document{
    _id : Types.ObjectId | string
    email : string,
    password : string,
}

const UserSchema = new Schema<UserDocument>(
    {
        email : {
            type : String,
            required : true,
        },
        password : {
            type : String,
            required : true,
        },
    },
    {timestamps : true}
);

export const UserModel = model<UserDocument>("User" , UserSchema);