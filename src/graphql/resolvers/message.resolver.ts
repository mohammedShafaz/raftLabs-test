import { GraphQLID, GraphQLString } from "graphql";
import { MessageType } from "../schemas/message.type";
import { PubSub } from "graphql-subscriptions";
import Message from "../../models/message.model";

const pubsub = new PubSub();

export const getMessageById = {
  type: MessageType,
  args: { id: { type: GraphQLID } },
  resolve: async (_: any, args: { [key: string]: any }) => {
    try {
      const message = await Message.findById(args.id);
      if (!message) {
        throw new Error("Message not found");
      }
      return message;
    } catch (error) {
      throw new Error("Error fetching message");
    }
  },
};

export const sendMessage = {
  type: MessageType,
  args: {
    content: { type: GraphQLString },
    roomId: { type: GraphQLID },
    receiverId: { type: GraphQLID },
  },
  resolve: async (parent: any, { content, roomId, receiverId }: { content: string; roomId: string; receiverId?: string }, context: any, info: unknown) => {
    try {
      const user = context.user;
``      
      if (!user) {
        throw new Error("User is not authenticated");
      }

      if (!content || !roomId) {
        throw new Error("Content and room ID are required");
      }
      const newMessage = new Message({
        sender: user.id,
        receiver: receiverId ? receiverId : null,
        content,
        room: roomId,
      });

      const savedMessage = await newMessage.save();

      pubsub.publish(`MESSAGE_ADDED_${roomId}`, {
        messageAdded: savedMessage,
    });
    
      return savedMessage;
    } catch (error) {
      console.error("Error sending message:", error)
      throw error;
    }
  },
};

export const messageResolvers = {
  Query: {
    getMessageById,
  },
  Mutation: {
    sendMessage,
  },
  Subscription: {
    messageAdded: {
      type: MessageType,
      args: {
        roomId: { type: GraphQLID },
      },
      subscribe: (_: any, { roomId }: { roomId: string }) => {
        if (!roomId) throw new Error("Room ID is required for subscription");
        return pubsub.asyncIterator([`MESSAGE_ADDED_${roomId}`]);
      },
      resolve: (payload: any) => payload.messageAdded,
    },
  },
};
