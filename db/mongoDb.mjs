import { MongoClient} from 'mongodb';
//Connect to remote mongo-database

const uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.DB_CLUSTER}.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;


//console.log(dsn);
const mongo = {
  /**
   * Connect to remote database
   * 
   * @returns object: mongo database
   */
  remoteMongo: async function remoteMongo() {
    console.log("initiate client")
    const client = new MongoClient(uri);
    console.log("try to connect client")
    await client.connect();
    console.log(" connected client")
    try {
      console.log("try to get/create database")
      const database = client.db(process.env.DB_NAME);
      console.log("try to get/create collection")
      const documents = database.collection(process.env.COLLECTION_NAME);
      console.log("try to return collection")
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
//run().catch(console.dir);