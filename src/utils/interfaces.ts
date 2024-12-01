import { Request } from "express"
import { Document, Schema } from "mongoose"
export interface CustomRequest extends Request {

    user?: any
}

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
}
export interface IMessage extends Document {
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    room: Schema.Types.ObjectId;
    content: string;
}
export interface IRoom extends Document{
    name: string;
    participants:Schema.Types.ObjectId;
}