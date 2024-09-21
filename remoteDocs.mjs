import mongoDb from './db/mongoDb.mjs'
import { ObjectId } from 'mongodb';


// Functionality
const mongoDocs = {

    /**
     * Show all documents in an collection.
     *
     * @async
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an promis.
     */
      getAll: async function getAll() {
        const remoteMongo = await mongoDb.remoteMongo();
        try {
            //get database         
            const documents = await remoteMongo.collection.find().toArray();
            return documents;
        } catch (error) {
            return error;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} title      title of document 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findTitles: async function findTitles(searched) {
        const query = {title: searched};

        const options = {
            projection: { _id: 1, title: 1, content: 1 }
        }
        const remoteMongo = await mongoDb.remoteMongo();
        try {
            return await remoteMongo.collection.find(query, options).toArray()       
        } catch (error) {
            throw error;
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
    updateOne: async function updateOne(id, title, content) {

        //const data = req.params;
 
        const filter = { _id: new ObjectId(`${id}`) };
    
        const options = { upsert: false }; // do not add document if the docuent with this title is note found
        const updateDoc = {
            $set: {
              title: title,
              content: content
            },
          };
        const remoteMongo = await mongoDb.remoteMongo();
        try {
            return await remoteMongo.collection.updateOne(filter, updateDoc, options);
        } catch (error) {
            throw error;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    addNew: async function addNew() {
        const remoteMongo = await mongoDb.remoteMongo();
        const data = {
            title: "unnamed",
            content: ""
        };
        try {
            console.log("try to insert doc")
            const document = await remoteMongo.collection.insertOne(data);
            return document;
        } catch (error) {
            throw error;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add empty document in the collection 
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
        const remoteMongo = await mongoDb.remoteMongo();
        try {
            console.log("try to delete by removeByID, id =", id);
            return await remoteMongo.collection.deleteOne({_id: new ObjectId(`${id}`)})       
        } catch (error) {
            throw error;
        } finally {
            await remoteMongo.client.close();
        }
    },

        /**
     * add empty document in the collection 
     *
     * @async
     * @param {string} title           documents title
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        removeByTitle: async function removeByTitle(title) {
            const remoteMongo = await mongoDb.remoteMongo();
            try {
                return await remoteMongo.collection.deleteOne({title: title});           
            } catch (error) {
                throw error;
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
            const remoteMongo = await mongoDb.remoteMongo();
            try {
                return await remoteMongo.collection.findOne({_id: new ObjectId(`${id}`)});           
            } catch (error) {
                throw error;
            } finally {
                await remoteMongo.client.close();
            }
        },
//     /**
//      * Find documents in an collection by matching search criteria.
//      *
//      * @async
//      *
//      * @param {string} col        Collection.
//      * @param {object} criteria   Search criteria.
//      * @param {object} projection What to project in results.
//      * @param {number} limit      Limit the number of documents to retrieve.
//      *
//      * @throws Error when database operation fails.
//      *
//      * @return {Promise<array>} The resultset as an array.
//      */
    
//     findInCollection: async function findInCollection(col, criteria, projection, limit) {
        
//         return await col.find(criteria, projection).limit(limit).toArray();
//     },
};

export default mongoDocs;