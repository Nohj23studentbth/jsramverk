process.env.NODE_ENV = 'test';

import database from '../../../db/mongo/mongoDb.mjs'; // Import the database module

describe('MongoDB Connection Test', () => {
    let dbClient;
    let collection;
  
    beforeAll(async () => {    
        const dbConnection = await database.connect();
        dbClient = dbConnection.client;

        const collections = 
        dbConnection.db.listCollections({ name: process.env.COLLECTION_NAME })
        .toArray()
            if (collections.length > 0) {
                console.log(`Collection ${process.env.COLLECTION_NAME} exists.`);
                collection = dbConnection.collection;
            } else {
                console.log(`Collection ${process.env.COLLECTION_NAME} does not exist.`);
                collection = dbConnection.db.collection(process.env.COLLECTION_NAME);
            }
    });
  
    afterAll(async () => {
      if (dbClient) {
        await dbClient.close(); // Close the connection after all tests
      }
    });

    describe('Test if database can insert data in collection', () => {
      it('should insert a document into the collection', async () => {
        const testData = { name: 'MongoTest', value: 123 };
    
        // Insert a document
        const insertResult = await collection.insertOne(testData);
        expect(insertResult.insertedId).toBeDefined(); // Ensure the document was inserted
    
        // Fetch the document
        const fetchedDoc = await collection.findOne({ name: 'MongoTest' });
        expect(fetchedDoc).not.toBeNull();
        expect(fetchedDoc.name).toBe(testData.name);
        expect(fetchedDoc.value).toBe(testData.value);
      });
    });

    describe('Test if database can remove data from collection', () => {
        it('should clean up the collection after each test', async () => {
            // Clean up any test data to keep the test environment consistent
            await collection.deleteMany({});
            const docs = await collection.find({}).toArray();
            expect(docs.length).toBe(0); // Ensure the collection is empty after cleanup
        });
    });
});
