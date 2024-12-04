import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { CreateUserInput, CreateUserResponseType, LoginResponseType, UserType } from "./schemas/user.type";
import { ICreateUserResponseType, ILoginResponse, IUser } from "../utils/interfaces";
import { resolvers } from "./resolvers";
import { MessageType, RoomType } from "./schemas";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            user: {
                type: UserType,
                args: { id: { type: GraphQLID } },
                resolve: resolvers.Query.user.resolve,
            },
            getMessageById: {
                type: MessageType,
                args: { id: { type: GraphQLID } },
                resolve: resolvers.Query.getMessageById.resolve,
            },
            getRoomById: {
                type: RoomType,
                args: { id: { type: GraphQLID } },
                resolve: resolvers.Query.getRoomById.resolve,
            },
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            createUser: {
                type: CreateUserResponseType,
                args: {
                    input: { type: CreateUserInput },
                },
                resolve: async (parent, args, context, info): Promise<ICreateUserResponseType> => {
                    const { input } = args;
                    return resolvers.Mutation.createUser.resolve(parent, { input }, context, info);
                },
            },
            login: {
                type: LoginResponseType,
                args: {
                    email: { type: GraphQLString },
                    password: { type: GraphQLString },
                },
                resolve: async (parent, args, context, info): Promise<ILoginResponse> => {
                    const { email, password } = args;
                    return resolvers.Mutation.login.resolve(parent, { email, password }, context, info);
                },
            },
            sendMessage: {
                type: MessageType,
                args: {
                    content: { type: GraphQLString },
                    roomId: { type: GraphQLID },
                    receiverId: { type: GraphQLID },
                },
                resolve: async (parent, { content, roomId,receiverId }, context, info) => {
                    return resolvers.Mutation.sendMessage.resolve(parent, { content, roomId, receiverId }, context, info);
                },
            },
            createRoom: {
                type: RoomType,
                args: {
                    name: { type: GraphQLString },
                },
                resolve: async (parent, { name }, context, info) => {
                    return resolvers.Mutation.createRoom.resolve(parent, { name }, context, info);
                },
            }
        }
    }),
    subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
            messageAdded: {
                type: MessageType,
                args: { roomId: { type: GraphQLID } },
                subscribe: (parent, { roomId }, { pubsub }) => {
                    return pubsub.asyncIterator(`MESSAGE_ADDED_${roomId}`);
                },
                resolve: (payload) => {
                    return payload.messageAdded;
                },
            },
        },
    }),
})
