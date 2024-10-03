import MongoClient from "mongodb";
import config from "./config.json"

const collectionName = "docs";

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.hkfbt.mongodb.net/folinodocs?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            // We can even use MongoDB Atlas for testing
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await MongoClient.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

export default database;