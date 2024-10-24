import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

const SheredDockType = new GraphQLObjectType({
    name: 'DocumentPair',
    description: 'Represents a pair of strings for shared documents',
    fields: () => ({
        username: { type: GraphQLString},
        dockid: { type: GraphQLString }
    })
});

export default SheredDockType;