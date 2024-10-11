/* global it describe before */

process.env.NODE_ENV = 'test';

import { parse } from 'node-html-parser';
import request from 'supertest'; // use supertest for HTTP requests
import server from '../../app.mjs';
import db from '../../db/mongo/mongoDb.mjs';

let apiKey = '';

describe('auth', () => {
//   beforeAll(async () => {
//     const list = db.db.listCollections(
//         { name: "test" }
//     )
//     console.log(list)
//     try {
//       if (list) {
//         await db.collection.drop();
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       await db.client.close();
//     }
//   });
  describe('GET /api_key', () => {
        it('200 HAPPY PATH getting form', async () => {
        const res = await request(server).get('/api_key');
        expect(res.status).toBe(200);
        });

        it('should get 200 as we get apiKey', async () => {
        const user = {
            email: 'test@auth.com',
            gdpr: 'gdpr',
        };

        const res = await request(server)
            .post('/api_key/confirmation')
            .send(user);

        expect(res.status).toBe(200);
        expect(typeof res.text).toBe('string');

        const HTMLResponse = parse(res.text);
        const apiKeyElement = HTMLResponse.querySelector('#apikey');
        expect(apiKeyElement).toBeInstanceOf(Object);

        apiKey = apiKeyElement.childNodes[0].rawText;
        expect(apiKey.length).toBe(32);
        });

    })

    afterAll((done) =>{
        server.close(done);
    })
// describe('auth', () => {
//     before(async () => {

//         const list = db.db.listCollections(
//             { name: "test" }
//         )
//         console.log(list)
//         next()
//             .then(async function(info) {
//                 if (info) {
//                     await db.collection.drop();
//                 }
//             })
//             .catch(function(err) {
//                 console.error(err);
//             })
//             .finally(async function() {
//                 await db.client.close();
//             });
//     });

    // describe('GET /api_key', () => {
    //     it('200 HAPPY PATH getting form', (done) => {
    //         request(server)
    //             .get("/api_key")
    //             .end((err, res) => {
    //                 expect(res.status).toBe(200);

    //                 done();
    //             });
    //     });

    //     it('should get 200 as we get apiKey', (done) => {
    //         let user = {
    //             email: "test@auth.com",
    //             gdpr: "gdpr"
    //         };

    //         request(server)
    //             .post("/api_key/confirmation")
    //             .send(user)
    //             .end((err, res) => {
    //                 expect(res.status).toBe(200);
    //                 expect(res.text).toBe.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let apiKeyElement = HTMLResponse.querySelector('#apikey');

    //                 apiKeyElement.should.be.an("object");

    //                 apiKey = apiKeyElement.childNodes[0].rawText;

    //                 apiKey.length.should.equal(32);

    //                 done();
    //             });
    //     });
    
    //     it('should get 200 but no apikey element not a valid email', (done) => {
    //         let user = {
    //             email: "test",
    //             gdpr: "gdpr"
    //         };

    //         request(server)
    //             .post("/api_key/confirmation")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.text.should.be.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let apiKeyElement = HTMLResponse.querySelector('#apikey');

    //                 (apiKeyElement === null).should.be.true;

    //                 let messageElement = HTMLResponse.querySelector('#error');

    //                 messageElement.should.be.an("object");

    //                 let message = messageElement.childNodes[0].rawText;

    //                 message.should.equal("A valid email address is required to obtain an API key.");

    //                 done();
    //             });
    //     });

    //     it('should get 200 but no apikey element no gdpr', (done) => {
    //         let user = {
    //             email: "test@auth.com"
    //         };

    //         request(server)
    //             .post("/api_key/confirmation")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.text.should.be.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let apiKeyElement = HTMLResponse.querySelector('#apikey');

    //                 (apiKeyElement === null).should.be.true;

    //                 let messageElement = HTMLResponse.querySelector('#error');

    //                 messageElement.should.be.an("object");

    //                 let message = messageElement.childNodes[0].rawText;

    //                 message.should.equal("Approve the terms and conditions.");

    //                 done();
    //             });
    //     });

    //     it('should get 200 but no apikey element not correct gdpr', (done) => {
    //         let user = {
    //             email: "test@auth.com",
    //             gdpr: "gdprgdpr"
    //         };

    //         request(server)
    //             .post("/api_key/confirmation")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.text.should.be.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let apiKeyElement = HTMLResponse.querySelector('#apikey');

    //                 (apiKeyElement === null).should.be.true;

    //                 let messageElement = HTMLResponse.querySelector('#error');

    //                 messageElement.should.be.an("object");

    //                 let message = messageElement.childNodes[0].rawText;

    //                 message.should.equal("Approve the terms and conditions.");

    //                 done();
    //             });
    //     });
    // });

    // describe('POST /register', () => {
    //     it('should get 401 as we do not provide valid api_key', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             password: "123test",
    //             // api_key: apiKey
    //         };

    //         request(server)
    //             .post("/register")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 401 as we do not provide email', (done) => {
    //         let user = {
    //             //email: "test@example.com",
    //             password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/register")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 401 as we do not provide password', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             // password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/register")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 201 HAPPY PATH', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/register")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(201);
    //                 res.body.should.be.an("object");
    //                 res.body.should.have.property("data");
    //                 res.body.data.should.have.property("message");
    //                 res.body.data.message.should.equal("User successfully registered.");

    //                 done();
    //             });
    //     });
    // });

    // describe('POST /login', () => {
    //     it('should get 401 as we do not provide valid api_key', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             password: "123test",
    //             // api_key: apiKey
    //         };

    //         request(server)
    //             .post("/login")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 401 as we do not provide email', (done) => {
    //         let user = {
    //             //email: "test@example.com",
    //             password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/login")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 401 as we do not provide password', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             // password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/login")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 401 as user not found', (done) => {
    //         let user = {
    //             email: "nobody@example.com",
    //             password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/login")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 401 incorrect password', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             password: "wrongpassword",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/login")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(401);
    //                 res.body.should.be.an("object");
    //                 res.body.errors.status.should.be.equal(401);
    //                 done();
    //             });
    //     });

    //     it('should get 201 HAPPY PATH', (done) => {
    //         let user = {
    //             email: "test@example.com",
    //             password: "123test",
    //             api_key: apiKey
    //         };

    //         request(server)
    //             .post("/login")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.an("object");
    //                 res.body.should.have.property("data");
    //                 res.body.data.should.have.property("type");
    //                 res.body.data.type.should.equal("success");
    //                 res.body.data.should.have.property("type");

    //                 done();
    //             });
    //     });
    // });

    // describe('deregister', () => {
    //     it('200 HAPPY PATH getting deregister form', (done) => {
    //         request(server)
    //             .get("/api_key/deregister")
    //             .end((err, res) => {
    //                 res.should.have.status(200);

    //                 done();
    //             });
    //     });

    //     it('should get 200 with message no apikey', (done) => {
    //         let user = {
    //             email: "test@auth.com",
    //             // apikey: apiKey
    //         };

    //         request(server)
    //             .post("/api_key/deregister")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.text.should.be.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let messageElement = HTMLResponse.querySelector('#error');

    //                 messageElement.should.be.an("object");

    //                 let message = messageElement.childNodes[0].rawText;

    //                 message.should.equal("Both E-mail and API-key is needed to deregister.");

    //                 done();
    //             });
    //     });

    //     it('should get 200 with message no email', (done) => {
    //         let user = {
    //             //email: "test@auth.com",
    //             apikey: apiKey
    //         };

    //         request(server)
    //             .post("/api_key/deregister")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.text.should.be.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let messageElement = HTMLResponse.querySelector('#error');

    //                 messageElement.should.be.an("object");

    //                 let message = messageElement.childNodes[0].rawText;

    //                 message.should.equal("Both E-mail and API-key is needed to deregister.");

    //                 done();
    //             });
    //     });

    //     it('should get 200 with message all data deleted', (done) => {
    //         let user = {
    //             email: "test@auth.com",
    //             apikey: apiKey
    //         };

    //         request(server)
    //             .post("/api_key/deregister")
    //             .send(user)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.text.should.be.a("string");

    //                 let HTMLResponse = parse(res.text);
    //                 let messageElement = HTMLResponse.querySelector('#error');

    //                 messageElement.should.be.an("object");

    //                 let message = messageElement.childNodes[0].rawText;

    //                 message.should.equal("All data has been deleted");

    //                 done();
    //             });
    //     });

    //     it('should get 401 no valid api key', (done) => {
    //         request(server)
    //             .get("/products?api_key=" + apiKey)
    //             .end((err, res) => {
    //                 expect(res.status).toBe(401);
    //                 expect(res.body).toBe.an("object");
    //                 expect(res.body.errors.status).toBe.equal(401);

    //                 done();
    //             });
    //     });
    
})
