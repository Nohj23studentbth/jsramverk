import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

import UserType from './user.mjs';
import DockType from './dock.mjs';

import userFunketions from './../models/users.mjs';

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            description: "a list of users",
            resolve: async function name() {
                return await userFunketions.getAll();
            }
        },
        user: {
            type: UserType,
            description: "a user, an object",
            args: {
                username: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                let users = await userFunketions.getAll();
                return users.find(user => user.username === args.username);
            }
        },

        userDocs: {
            type: new GraphQLList(DockType),
            description: "a list with dokuments of a users",
            args: {
                username: {type: GraphQLString},
            },
            resolve: async function(parent, args) {
                let users = await userFunketions.getAll();
                let user = users.find(user => user.username === args.username);
                if(user){
                    return user.documents;
                }
                throw new Error("user does not exists");
            }
        },

        userDoc: {
            type: DockType,
            description: "a dokument of a users",
            args: {
                username: {type: GraphQLString},
                docid: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                let users = await userFunketions.getAll();
                let user = users.find(user => user.username === args.username);
                if(user){
                    return user.documents.find(doc => doc.docid === args.docid);
                }
                throw new Error("document does not exists");
            }
        },

        sharedWithUser: {
            type: new GraphQLList(DockType),
            description: "a list with dokuments of other users that are shared with this user",
            args: {
                username: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                let users = await userFunketions.getAll();
                let sharedDocs = [];

                // Iterate over users and their documents
                users.forEach(user => {
                    if (user.documents && user.documents.length > 0) {
                        // Filter documents where the 'shared' field contains the specific username
                        const filteredDocs = user.documents.filter(doc =>
                            doc.shared && doc.shared.includes(args.username)
                        );
                        
                        // Add the filtered documents to the sharedDocs array
                        sharedDocs.push(...filteredDocs);
                    }
                });

                return sharedDocs;
            }
        },
        sharedDoc: {
            type: DockType,
            description: "a dokument of another user that are shared with this user",
            args: {
                username: {type: GraphQLString}, // the name of use that can reach document
                docid: {type: GraphQLString} // _id of document
            },
            resolve: async function(parent, args) {
                let users = await userFunketions.getAll();
                let sharedDocs = [];

                    // Iterate over users and their documents
                    users.forEach(user => {
                        if (user.documents && user.documents.length > 0) {
                            // Filter documents where the 'shared' field contains the specific username
                            const filteredDocs = user.documents.filter(doc =>
                                doc.shared && doc.shared.includes(args.username)
                            );
                            
                            // Add the filtered documents to the sharedDocs array
                            sharedDocs.push(...filteredDocs);
                        }
                    });

                    return sharedDocs.find(doc => doc.docid === args.docid);
                }
            }
        })
});

export default RootQueryType;
