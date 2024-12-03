import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";
import { IUser } from "../../utils/interfaces";

export const UserType = new GraphQLObjectType<IUser>({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
    },
});
export const CreateUserInput = new GraphQLInputObjectType({
    name: "CreateUserInput",
    fields: {
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
});

export const LoginResponseType = new GraphQLObjectType({
    name: "LoginResponse",
    fields: {
        status: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        token: { type: GraphQLString },
    },
});

export const CreateUserResponseType= new GraphQLObjectType({
    name:"createUserResponse",
    fields:{
        status: {type:GraphQLBoolean},
        message:{type:GraphQLString},
        user:{type:UserType},
    }
})