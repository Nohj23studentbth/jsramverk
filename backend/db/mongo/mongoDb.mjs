import 'dotenv/config';
import { MongoClient, ServerApiVersion} from 'mongodb';

//Connect to remote mongo-database
let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.DB_CLUSTER}.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;
//let uri = "mongodb://localhost:27017";

/**
 * Connect to remote database
 * 
 * @returns object: mongo database
 */
const database = { 
     connect: async function connect() {
        //process.env.DB_NAME = "docs";
        if (process.env.NODE_ENV === 'test') {
            uri = "mongodb://localhost:27017/test";
        }
        console.log(uri)
        const client = new MongoClient(uri, {
                    serverApi: {version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true
                }
            }
        );

        await client.connect();
        try {
            const db = client.db(process.env.DB_NAME);
            const users = db.collection(process.env.COLLECTION_NAME);
            return {db:db, client: client, collection: users};
        } catch (error) {
            console.error("Error by remote connection: ", error);
            await client.close(); // Close client on error
            throw error; // Rethrow the error for proper handling
        }
  }
}
  
export default database;
