db.createCollection("users", {
    "validator": {
       "$jsonSchema": {
          "bsonType": "object",
          "title": "Users Object Validation",
          "required": [ "username", "password" ],
          "properties": {
             "username": {
                "bsonType": "string",
                "description": "'email' uses as 'name' must be a string/email and is required"
             },
             "password": {
                "bsonType": "string",
                "description": "pathword must be an unik string and is required"
             },
             "documents": {
                "bsonType": "array",
                "description": "'documents' is an array of objects and is not required",
                "items": {  // Correctly define items for the array
                    "bsonType": "object",
                    "properties": {
                        "title": {
                            "bsonType": "string",
                            "description": "'title' is a string and is not required"
                        },
                        "content": {
                            "bsonType": "string",
                            "description": "'content' is a string and is not required"
                        },
                        "allowd_users": {
                            "bsonType": "array",
                            "description": "'allowd_users' is an array of strings and is not required",
                        }
                    }
                }
             }
          }
       }
    }
});

db.collection.createIndex({ username: 1 }, { unique: true })

[   {username: "polga@olga", email: "polga@olga"}
]
db.users.insertOne({
    username: "olga@example.com",
    password: "olga@example.com",
});
db.users.insertOne({username: "polga@olga", password: "polga@olga"});