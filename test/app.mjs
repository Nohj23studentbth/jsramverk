/* global it describe */

process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { server, app } from '../app.mjs';  // Import your Express app
// to remove temporary fils
import fs from 'fs';
import path from 'path';

chai.should();
chai.use(chaiHttp);

// OPTIONAL shortcat for the "chai.expect"
const { expect } = chai;
// tests will be writen as:
describe('API Tests', () => {
    it('should return status 200 and a message', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Hello World' });
    });

    // Add more tests as needed
});

describe('Express App', () => {
    describe('GET /', () => {
        it('should return 200 for the base route', (done) => {
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);  // Expecting a 200 response
                    done();
                });
        });
    });
});

after((done) => {
    // Replace 'your-socket-file.sock' with the actual file name
    const socketFilePath = path.join(__dirname, 'your-socket-file.sock'); 

    // Remove the socket file if it exists
    fs.unlink(socketFilePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error removing socket file:', err);
        }
        server.close(done);
    });
});

//     describe('GET /undefined-route', () => {
//         it('should return 404 for an undefined route', (done) => {
//             chai.request(server)
//                 .get("/undefined-route")
//                 .end((err, res) => {
//                     res.should.have.status(404);  // Expecting a 404 response
//                     res.body.should.be.an('object');
//                     res.body.errors[0].title.should.equal("Not Found");
//                     done();
//                 });
//         });
//     });

//     describe('Error Handling', () => {
//         it('should handle errors correctly', (done) => {
//             // Simulating an error by sending a request that is expected to fail
//             chai.request(server)
//                 .get("/api/error") // Assuming you have a route that intentionally throws an error
//                 .end((err, res) => {
//                     res.should.have.status(500); // Expecting a 500 response
//                     res.body.should.be.an('object');
//                     res.body.errors[0].title.should.equal("Internal Server Error"); // Adjust based on your error messages
//                     done();
//                 });
//         });
//     });

//     describe('CORS Middleware', () => {
//         it('should allow cross-origin requests', (done) => {
//             chai.request(server)
//                 .options("/") // Use OPTIONS method to check CORS
//                 .end((err, res) => {
//                     res.should.have.status(200);  // Expecting a 200 response
//                     res.headers.should.have.property('access-control-allow-origin'); // Check CORS header
//                     done();
//                 });
//         });
//     });
// });
