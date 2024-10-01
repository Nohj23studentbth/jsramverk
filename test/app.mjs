/* global it describe */

process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.mjs';  // Import your Express app

chai.should();
chai.use(chaiHttp);

describe('Express App', () => {
    describe('GET /', () => {
        it('should return 200 for the base route', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);  // Expecting a 200 response
                    done();
                });
        });
    });

    describe('GET /undefined-route', () => {
        it('should return 404 for an undefined route', (done) => {
            chai.request(server)
                .get("/undefined-route")
                .end((err, res) => {
                    res.should.have.status(404);  // Expecting a 404 response
                    res.body.should.be.an('object');
                    res.body.errors[0].title.should.equal("Not Found");
                    done();
                });
        });
    });

    describe('Error Handling', () => {
        it('should handle errors correctly', (done) => {
            // Simulating an error by sending a request that is expected to fail
            chai.request(server)
                .get("/api/error") // Assuming you have a route that intentionally throws an error
                .end((err, res) => {
                    res.should.have.status(500); // Expecting a 500 response
                    res.body.should.be.an('object');
                    res.body.errors[0].title.should.equal("Internal Server Error"); // Adjust based on your error messages
                    done();
                });
        });
    });

    describe('CORS Middleware', () => {
        it('should allow cross-origin requests', (done) => {
            chai.request(server)
                .options("/") // Use OPTIONS method to check CORS
                .end((err, res) => {
                    res.should.have.status(200);  // Expecting a 200 response
                    res.headers.should.have.property('access-control-allow-origin'); // Check CORS header
                    done();
                });
        });
    });
});
