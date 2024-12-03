import { GraphQLID, GraphQLString } from "graphql";
import { RoomType } from "../schemas/room.type";
import Room from "../../models/rooms.model";

export const getRoomById = {
  type: RoomType,
  args: { id: { type: GraphQLID } },
  resolve: async (_: any, args: { [key: string]: any }) => {
    try {
      const room = await Room.findById(args.id);
      if (!room) {
        throw new Error("Room not found");
      }
      return room;
    } catch (error) {
      throw new Error("Error fetching room");
    }
  },
};

export const createRoom = {
  type: RoomType,
  args: {
    name: { type: GraphQLString },
  },
  resolve: async (parent: any, { name }: { name: string; }, context: any, info: unknown) => {
    try {
      const user = context.user;
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const newRoom = new Room({
        name,
      });

      const savedRoom = await newRoom.save();
      return savedRoom;
    } catch (error) {
      throw new Error("Error creating room");
    }
  },
};

export const roomResolvers = {
  Query: {
    getRoomById,
  },
  Mutation: {
    createRoom,
  },
};
