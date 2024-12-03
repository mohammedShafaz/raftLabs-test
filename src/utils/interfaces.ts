import { Request } from "express"
import { ObjectId } from "mongodb";
import { Document, Schema } from "mongoose"
export interface CustomRequest extends Request {

    user?: any
}

export interface IUser {
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
export interface IRoom extends Document {
    name: string;
    participants: Schema.Types.ObjectId[];
}

export interface JwtPayload {
    userId: string;
    email: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginResponse {
    status: boolean;
    message: string;
    token: string;
}

export interface ICreateUserInput {
    fullName: string;
    email: string;
    password: string;
}
export interface IUserResponse {
    id: Schema.Types.ObjectId | ObjectId;
    fullName: string;
    email: string;
}
export interface ICreateUserResponseType {
    status: boolean;
    message: string;
    user: {
        id:Schema.Types.ObjectId | ObjectId;
        fullName: string;
        email: string;
    };
}
