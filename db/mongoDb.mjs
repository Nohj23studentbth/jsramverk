// import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
//Connect to remote mongo-database

let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.DB_CLUSTER}.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;
//const testUri = "mongodb://localhost:27017/test";



const client = new MongoClient(uri,
    {serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//console.log(dsn);
const mongo = {
    /**
     * Connect to remote database
     * 
     * @returns object: mongo database
     */
    remoteMongo: async function remoteMongo() {
        if (process.env.NODE_ENV === 'test') {
            uri = "mongodb://localhost:27017/test";
            console.log('USE LOCAL DATABASE');
        }
        console.log(uri);
        await client.connect();
        try {
            const database = client.db(process.env.DB_NAME);
            const documents = database.collection(process.env.COLLECTION_NAME);
            return {client: client, collection: documents};
        } catch (error) {
            console.log("error by remote connection : ", error);
        }
    },
    
  // /**
  //  * Create connection to local MongoDB
  //  * 
  //  * @returns {Promise<object>}: local mongo db
  //  */
  // localMongo: async function localMongo () {
  //   console.log("start localMOngo")
    
  //   if (process.env.NODE_ENV === 'test') {
  //       dsn = "mongodb://localhost:27017/test";
  //   }
  //   const client = new MongoClient({process.env.LOCAL_DSN);
  //   console.log("after getting clietn")
  //   try {
  //     console.log('Client will be connected');
  //     await client.connect();

  //     const db = client.db(process.env.DB_NAME);
  //     const collection = db.collection(process.env.COLLECTION_NAME);

  //     return {client: client, collection: collection};

  //   } catch (error) {
  //       console.error("Error connecting to MongoDB:", error);
  //       throw error; // Re-throw error for proper handling
  //   }
  // }
}
  
export default mongo;
