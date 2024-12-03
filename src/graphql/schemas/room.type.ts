import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } from "graphql";

export const RoomType = new GraphQLObjectType({
    name: 'Room',
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      participants: { type: new GraphQLList(GraphQLID) },
    },
  });