import  {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLNonNull
} from 'graphql';

const DockType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: GraphQLString },
        title: { type: GraphQLString},
        content: { type:GraphQLString },
        sharedWith: {
            type:  GraphQLString,
        }
    })
});

export default DockType;