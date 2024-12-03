import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: {
      id: { type: GraphQLID },
      sender: { type: GraphQLID },
      receiver: { type: GraphQLID },
      room: { type: GraphQLID },
      content: { type: GraphQLString },
    },
  });