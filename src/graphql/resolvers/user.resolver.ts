import { GraphQLID, GraphQLString } from "graphql";
import { CreateUserInput, UserType, LoginResponseType, CreateUserResponseType } from "../schemas/user.type";
import User from "../../models/users.model";
import { ICreateUserInput, ICreateUserResponseType, ILogin, IUser, IUserResponse } from "../../utils/interfaces";
import * as bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import config from "../../config/config";


export const getUserById = {
    type: UserType,
    args: { id: { type: GraphQLID } },
    async resolve(_: any, args: any) {
        try {
            if (!args.id) {
                throw new Error("ID is required");
            }
            const user = await User.findById(args.id);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw new Error("Error fetching user");
        }
    },
};

export const createUser = {
    type: CreateUserResponseType,
    args: {
        input: { type: CreateUserInput }
    },
    resolve: async (parent: any, { input }: { input: ICreateUserInput }, context: any, info: any):Promise<ICreateUserResponseType> => {
        try {
            const { fullName, email, password } = input;
            if (!fullName || !email || !password) {
                throw new Error("Missing parameters")
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ fullName, email, password: hashedPassword });
            const savedUser = await newUser.save();
            const user: IUserResponse = {
                id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
            };
            return {
                status: true,
                message: "User created successfully",
                user
            };
        } catch (error) {
            throw error;
        }

    }
};

export const login = {
    type: LoginResponseType,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },

    resolve: async (parent: any, { email, password }: { email: string, password: string }, context: any, info: any) => {

        try {
            if (!email || !password) {
                throw new Error("Missing parameters")
            }

            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Invalid email");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }
            const tokenPayload = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            }
            const token = jwt.sign(tokenPayload, config.jwtSecret!, { expiresIn: "48h" });
            return {
                status: true,
                message: "Login successful",
                token,
            }
        } catch (error) {
            throw error;
        }

    }
};

