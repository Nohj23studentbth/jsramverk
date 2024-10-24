import database from "../db/mongo/mongoDb.mjs";


const users = {
    getAll: async function (apiKey=null) {
        let db;
        try {
            db = await database.connect();
            let filter = null;
            if(apiKey){
                filter = { key: apiKey };
            }

            const suppress = { users: { username: 1, password: 0 }};

            //const keyObject = await db.collection.findOne(filter, suppress);

            const keyObject = await db.collection.find({}).toArray();
            let returnObject = [];

            if (keyObject) {
                returnObject = keyObject.map(function(user) {
                    return {
                        userid: user._id.toString(), // Ensure these fields exist in your documents
                        username: user.username,
                        password: user.password,
                        documents: user.documents,
                        sharedDocuments: user.sharedDocuments
                    } // Ensure this is structured correctly
                });
            }

           //console.log("returnObject: ", returnObject);

            return returnObject;
        } catch (err) {
            console.log("EROOR IN USERS MODELS")
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "/users",
                    title: "Database error",
                    message: err.message
                }
            });
        } finally {
            await db.client.close();
        }
    }
};

export default users;
