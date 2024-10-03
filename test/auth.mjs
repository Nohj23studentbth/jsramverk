/* global it describe */
process.env.NODE_ENV = 'test';
process.env.PORT = 4000;


import * as chaiModule from "chai"; // fingerar inte med enkelt import pga js-filer i chai
import chaiHttp from "chai-http";
import {server} from "../app.mjs"; // det finns inte defoult export
//import documents from "../remoteDocs.mjs"

const chai = chaiModule.use(chaiHttp);

chai.should();

import database from "../db/mongoDb.mjs"

const collectionName = "keys";    // Define the collection name

describe('auth', () => {
    before((done) => {
        // Set the test port to 4000 using environment variable
        process.env.PORT = 4000;
        done();
      });
    before(async () => {
        const db = await database.getDb(); // Get the database connection

        // Check if the collection exists and drop it if it does
        await db.db.listCollections({ name: collectionName })
            .next()
            .then(async (info) => {
                if (info) {
                    await db.db.collection(collectionName).drop(); // Correctly drop the collection
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

    after(async () => {
        // Optional: Clean up the collection after tests
        const db = await database.getDb();
        await db.db.collection(collectionName).drop().catch(() => {});
        await db.client.close(); // Close the database connection
    });
});
