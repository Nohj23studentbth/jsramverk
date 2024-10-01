// /* global it describe */

// process.env.NODE_ENV = 'test';

// import * as chai from 'chai';
// import chaiHttp from 'chai-http';
// import database from "../db/mongoDb.mjs"; // Import your database module

// chai.should();                    // Chai should syntax for assertions

// const collectionName = "keys";    // Define the collection name

// chai.use(chaiHttp);               // Use chai-http

// describe('auth', () => {
//     before(async () => {
//         const db = await database.getDb(); // Get the database connection

//         // Check if the collection exists and drop it if it does
//         await db.db.listCollections({ name: collectionName })
//             .next()
//             .then(async (info) => {
//                 if (info) {
//                     await db.db.collection(collectionName).drop(); // Correctly drop the collection
//                 }
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     });

//     after(async () => {
//         // Optional: Clean up the collection after tests
//         const db = await database.getDb();
//         await db.db.collection(collectionName).drop().catch(() => {});
//         await db.client.close(); // Close the database connection
//     });
// });
