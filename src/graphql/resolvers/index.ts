import { createUser, getUserById, login } from "./user.resolver";
import { messageResolvers } from "./message.resolver";
import { roomResolvers } from "./room.resolver";


export const resolvers = {
    Query: {
        user: getUserById,
        getMessageById: messageResolvers.Query.getMessageById,
        getRoomById: roomResolvers.Query.getRoomById,
    },
    Mutation: {
        createUser,
        login,
        sendMessage: messageResolvers.Mutation.sendMessage,
        createRoom: roomResolvers.Mutation.createRoom,
    },
    Subscription: {
        messageAdded: messageResolvers.Subscription.messageAdded,
      },
};