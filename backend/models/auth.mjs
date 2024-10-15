import getDb from "../db/mongo/mongoDb.mjs";
import users from "../docs/remoteDocs.mjs";
import hat from "hat";
import validate from "email-validator";

//import { compare, hash as _hash } from 'bcryptjs';
import bcrypt from 'bcryptjs';
//import { sign, verify } from 'jsonwebtoken';
import webtocken from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || "Olgas_new_oldjwssekret";

const auth = {
    // checkAPIKey: function (req, res, next) {
    //     if ( req.path == '/') {
    //         console.log(req.path)
    //         return next();
    //     }

    //     if ( req.path == '/api_key') {
    //         console.log(req.path)
    //         return next();
    //     }

    //     if ( req.path == '/api_key/confirmation') {
    //         console.log(req.path)
    //         return next();
    //     }

    //     if ( req.path == '/api_key/deregister') {
    //         console.log(req.path)
    //         return next();
    //     }

    //     auth.isValidAPIKey(req.query.api_key || req.body.api_key, next, req.path, res);
    // },

    // isValidAPIKey: async function(apiKey, next, path, res) {
    //     try {
    //         const db = await getDb.db;

    //         const filter = { key: apiKey };

    //         const keyObject = await db.collection.findOne(filter);

    //         if (keyObject) {
    //             await db.client.close();

    //             return next();
    //         }

    //         return res.status(401).json({
    //             errors: {
    //                 status: 401,
    //                 source: path,
    //                 title: "Valid API key",
    //                 detail: "No valid API key provided."
    //             }
    //         });
    //     } catch (e) {
    //         return res.status(500).json({
    //             errors: {
    //                 status: 500,
    //                 source: path,
    //                 title: "Database error",
    //                 detail: e.message
    //             }
    //         });
    //     }
    // },

    // getNewAPIKey: async function(res, email) {
    //     let data = {
    //         apiKey: ""
    //     };

    //     if (email === undefined || !validate(email)) {
    //         data.message = "A valid email address is required to obtain an API key.";
    //         data.email = email;

    //         return res.render("api_key/form", data);
    //     }

    //     try {
    //         const db = await getDb.db;

    //         const filter = { email: email };

    //         const keyObject = await db.collection.findOne(filter);

    //         if (keyObject) {
    //             data.apiKey = keyObject.key;

    //             return res.render("api_key/confirmation", data);
    //         }

    //         return auth.getUniqueAPIKey(res, email, db);
    //     } catch (e) {
    //         data.message = "Database error: " + e.message;
    //         data.email = email;

    //         return res.render("api_key/form", data);
    //     }
    // },

    // getUniqueAPIKey: async function(res, email, db) {
    //     const apiKey = hat();
    //     let data = {
    //         apiKey: ""
    //     };

    //     try {
    //         const filter = { key: apiKey };

    //         const keyObject = await db.collection.findOne(filter);

    //         if (!keyObject) {
    //             return await auth.insertApiKey(
    //                 res,
    //                 email,
    //                 apiKey,
    //                 db
    //             );
    //         }

    //         return await auth.getUniqueAPIKey(res, email, db);
    //     } catch (e) {
    //         data.message = "Database error: " + e.message;
    //         data.email = email;

    //         return res.render("api_key/form", data);
    //     }
    // },

    // insertApiKey: async function(res, email, apiKey, db) {
    //     let data = {};

    //     try {
    //         data.apiKey = apiKey;

    //         const doc = { email: email, key: apiKey };

    //         await db.collection.insertOne(doc);

    //         return res.render("api_key/confirmation", data);
    //     } catch (e) {
    //         data.message = "Database error: " + e.message;
    //         data.email = email;

    //         return res.render("api_key/form", data);
    //     } finally {
    //         await db.client.close();
    //     }
    // },

    // deregister: async function(res, body) {
    //     const email = body.email;
    //     const apiKey = body.apikey;

    //     try {
    //         const db = await getDb.db;

    //         const filter = { key: apiKey, email: email };

    //         const keyObject = await db.collection.findOne(filter);

    //         if (keyObject) {
    //             return await auth.deleteData(res, apiKey, email, db);
    //         } else {
    //             let data = {
    //                 message: "The E-mail and API-key combination does not exist.",
    //                 email: email,
    //                 apikey: apiKey
    //             };

    //             await db.client.close();

    //             return res.render("api_key/deregister", data);
    //         }
    //     } catch (e) {
    //         let data = {
    //             message: "Database error: " + e.message,
    //             email: email,
    //             apikey: apiKey
    //         };

    //         return res.render("api_key/deregister", data);
    //     }
    // },

    // deleteData: async function(res, apiKey, email, db) {
    //     try {
    //         const filter = { key: apiKey, email: email };

    //         await db.collection.deleteOne(filter);

    //         let data = {
    //             message: "All data has been deleted",
    //             email: "",
    //         };

    //         return res.render("api_key/form", data);
    //     } catch (e) {
    //         let data = {
    //             message: "Could not delete data due to: " + e.message,
    //             email: email,
    //             apikey: apiKey
    //         };

    //         return res.render("api_key/deregister", data);
    //     } finally {
    //         await db.client.close();
    //     }
    // },

    login: async function(req, res) {
        const email = req.name;
        const password = req.password;
        //const apiKey = body.api_key;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        let user;

        let db;
        try {
            console.log("connect DB")
            db = await getDb.connect();
            user = await users.findPassword(db.collection, password);

            // const filter = { users: {
            //     $elemMatch: {
            //         email: password
            //     }
            // } };
            const filter = {email: password}

            //user = await db.collection.findOne(filter);

            console.log(user)

            if (user) {
                console.log("there is user")
                return auth.comparePasswords(
                    res,
                    password,
                    user.users[0],
                );
            } else {
                console.log("no susers")
                return res.status(401).json({

                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: function(res, password, user) {
        if (user.password === password) {
            return res.json({
                data: {
                    type: "success",
                    message: "User logged in",
                    user: user,
                    //token: jwtToken
                }
            });

        }
        // bcrypt.compare(password, user.password, (err, result) => {
        //     if (err) {
        //         return res.status(500).json({
        //             errors: {
        //                 status: 500,
        //                 source: "/login",
        //                 title: "bcrypt error",
        //                 detail: "bcrypt error"
        //             }
        //         });
        //     }

        //     if (result) {
        //         let payload = { api_key: user.apiKey, email: user.email };
        //         let jwtToken = webtocken.sign(payload, jwtSecret, { expiresIn: '24h' });

        //         return res.json({
        //             data: {
        //                 type: "success",
        //                 message: "User logged in",
        //                 user: payload,
        //                 token: jwtToken
        //             }
        //         });
        //     }

        //     return res.status(401).json({
        //         errors: {
        //             status: 401,
        //             source: "/login",
        //             title: "Wrong password",
        //             detail: "Password is incorrect."
        //         }
        //     });
        // });
    },

    // register: async function(res, body) {
    //     const email = body.email;
    //     const password = body.password;
    //     const apiKey = body.api_key;

    //     if (!email || !password) {
    //         return res.status(401).json({
    //             errors: {
    //                 status: 401,
    //                 source: "/register",
    //                 title: "Email or password missing",
    //                 detail: "Email or password missing in request"
    //             }
    //         });
    //     }

    //     bcrypt.hash(password, 10, async function(err, hash) {
    //         if (err) {
    //             return res.status(500).json({
    //                 errors: {
    //                     status: 500,
    //                     source: "/register",
    //                     title: "bcrypt error",
    //                     detail: "bcrypt error"
    //                 }
    //             });
    //         }

    //         let db;

    //         try {
    //             db = await getDb.db;

    //             let filter = { key: apiKey };
    //             let updateDoc = {
    //                 $push: {
    //                     users: {
    //                         email: email,
    //                         password: hash,
    //                     }
    //                 }
    //             };

    //             await db.collection.updateOne(filter, updateDoc);

    //             return res.status(201).json({
    //                 data: {
    //                     message: "User successfully registered."
    //                 }
    //             });
    //         } catch (e) {
    //             return res.status(500).json({
    //                 errors: {
    //                     status: 500,
    //                     source: "/register",
    //                     title: "Database error",
    //                     detail: err.message
    //                 }
    //             });
    //         } finally {
    //             await db.client.close();
    //         }
    //     });
    // },

    // checkToken: function(req, res, next) {
    //     let token = req.headers['x-access-token'];
    //     let apiKey = req.query.api_key || req.body.api_key;

    //     if (token) {
    //         webtocken.verify(token, jwtSecret, function(err, decoded) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     errors: {
    //                         status: 500,
    //                         source: req.path,
    //                         title: "Failed authentication",
    //                         detail: err.message
    //                     }
    //                 });
    //             }

    //             req.user = {};
    //             req.user.api_key = apiKey;
    //             req.user.email = decoded.email;

    //             return next();
    //         });
    //     } else {
    //         return res.status(401).json({
    //             errors: {
    //                 status: 401,
    //                 source: req.path,
    //                 title: "No token",
    //                 detail: "No token provided in request headers"
    //             }
    //         });
    //     }
    //}
};

export default auth;