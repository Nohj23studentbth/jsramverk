import database from '../db/mongo/mongoDb.mjs'
import { ObjectId } from 'mongodb';


// Functionality
const mongoDocs = {
    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     * 
     * @param {string} name  users email 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    userDocuments: async function userDocuments(name) {
        const query = {'username': name};

        const options = {
            //projection: { _id: 1, title: 1, content: 1 }
            projection: { documents: 1 }
        }
        const remoteMongo = await database.connect();
        try {
           const result = await remoteMongo.collection.find(query, options).toArray();
            return result[0].documents
        } finally {
            await remoteMongo.client.close();
        }
    },

        /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     * 
     * @param {string} name  users email
     * @param {string} userPassword users userPassword
     * @param {string} searched     title of document 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findDocument: async function findDocument(name, password, searched) {
        const query = {username: name, password: password};

        const options = {
            //projection: { _id: 1, title: 1, content: 1 }
            projection: { documents: 1 }
        }
        const remoteMongo = await database.connect();
        try {
            const docs = await remoteMongo.collection.find(query, options).toArray();
            const one = docs.find(one => one.title === searched);
            if(!one) { 
                return "not found";
            } 
            return one;                
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * update documents in an collection 
     * or create one if doc does not exists.
     *
     * @async
     *
     * @param {string} title        documents title
     * @param {string} content      documents content
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    updateDocument: async function updateDocument(username, id, title, content) {
        const query = {
            "username": username,
            "documents._id": new ObjectId(`${id}`)
        };
        const options = { upsert: false }; // do not add document if the docuent with this title is note found
        const updateDoc = {
            $set: {
                "documents.$.title": title,
                "documents.$.content": content
            },
            };
        const remoteMongo = await database.connect();
        try {
            return await remoteMongo.collection.updateOne(query, updateDoc, options);
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     * 
     * @param {string} username  users email
     * @param {string} password users userPassword
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    newDocument: async function newDocument(username) {
        const query = {'username': username };
    
        const remoteMongo = await database.connect();  // Assume this returns the DB connection
    
        // Create the new document object to push into the `documents` array
        const document = {
            _id: new ObjectId(),  // Generate new ObjectId for the document
            title: "New document",
            content: ""
        };
    
        try {   
            // Use `updateOne` to push the new document into the `documents` array
            const result = await remoteMongo.collection.updateOne(
                query,                                   // Query to find the user by username
                { $push: { documents: document } }       // Push the new document into the `documents` array
            );

            return result;
        } catch (error) {
            throw error;
        } finally {
            await remoteMongo.client.close();
        }
    },
   
    /**
     * add new user in the collection 
     *
     * @async
     * 
     * @param {string} name  users email
     * @param {string} userPassword users userPassword
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    addUser: async function addUser(name, userPassword) {
        const remoteMongo = await database.connect();
        const data = {
            username: name,
            password: userPassword
        };
        try {
            const document = await remoteMongo.collection.insertOne(data);
            return document;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add new user in the collection 
     *
     * @async
     * 
     * @param {string} name  users email
     * @param {string} userPassword users userPassword
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findUser: async function findUser(name, userPassword) {
        const remoteMongo = await database.connect();
        const data = {
            username: name,
            password: userPassword
        };
        try {
            const user = await remoteMongo.collection.findOne({password: userPassword});
            if(user.username === name){
                return user;
            } else {
                throw new Error("Name is false")
            }
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * remove document by _id from the collection 
     *
     * @async
     * @param {string} id           documents id (_id)
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    removeById: async function removeById(id) {
        //get database
        const remoteMongo = await database.connect();
        try {
            return await remoteMongo.collection.deleteOne({_id: new ObjectId(`${id}`)})       
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * remove document by _id from the collection 
     *
     * @async
     * 
     * @param {string} id           documents id (_id)
     * @param {string} username  users email
     * @param {string} password users userPassword
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    removeDocument: async function removeDocument(id, userName) {
        const query = {'username': userName};
        const remove = { documents: {_id: new ObjectId(`${id}`)}};
        const remoteMongo = await database.connect();

        try {
            const result = await remoteMongo.collection.updateOne(query, { $pull: remove});
            return result;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * remove document vy title in the collection 
     *
     * @async
     * @param {string} title           documents title
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        removeByTitle: async function removeByTitle(title) {
            const remoteMongo = await database.connect();
            try {
                return await remoteMongo.collection.deleteOne({title: title});           
            } finally {
                await remoteMongo.client.close();
            }
        },

    /**
     * fiend document in the collection by _id
     *
     * @async
     * @param {string} id           documents id (_id)
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        getByID: async function getByID(id) {
            const remoteMongo = await database.connect();
            try {
                return await remoteMongo.collection.findOne({_id: new ObjectId(`${id}`)});           
            } finally {
                await remoteMongo.client.close();
            }
        },
    
    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} col        Collection.
     * @param {string} pass   Search password.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an array.
     */
    
    findByPassword: async function finedByPassword(col, pass) {
        const remoteMongo = await database.connect();
        try {
            return await remoteMongo.collection.findOne({password: pass});
        } finally {
            await remoteMongo.client.close();
        }
    },

    // /**
    //  * Find documents in an collection by matching search criteria.
    //  *
    //  * @async
    //  *
    //  * @param {string} col        Collection.
    //  * @param {object} criteria   Search criteria.
    //  * @param {object} projection What to project in results.
    //  * @param {number} limit      Limit the number of documents to retrieve.
    //  *
    //  * @throws Error when database operation fails.
    //  *
    //  * @return {Promise<array>} The resultset as an array.
    //  */
    
    // findInCollection: async function findInCollection(col, criteria, projection, limit = 1) {
        
    //     return await col.find(criteria, projection).limit(limit).toArray();
    // },
};

export default mongoDocs;