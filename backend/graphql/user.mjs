import  {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import SheredDockType from './shareddock.mjs'

import DockType from "./dock.mjs";

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        userid: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        documents: {
            type: new GraphQLList(DockType),
            resolve: (user) => {
                return user.documents || [];
            }
        },
        sharedDocuments: {
            type: new GraphQLList(SheredDockType),  // Corrected type definition
            resolve: (user) => {
                return user.sharedDocuments ||[];
            }
        }
    })
})

export default UserType;