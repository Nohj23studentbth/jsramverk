/* global it describe */
process.env.NODE_ENV = 'test';

import * as chaiModule from "chai"; // fingerar inte med enkelt import pga js-filer i chai
import chaiHttp from "chai-http";
import {server} from "../app.mjs"; // det finns inte defoult export
//import documents from "../remoteDocs.mjs"

const chai = chaiModule.use(chaiHttp);

chai.should();

// test för incomst router
describe('Reports', () => {
    describe('GET /', () => {
        it('should get array of documents', (done) => {  
            chai.request.execute(server)
                .get("/") // Your endpoint to fetch documents
                .end((err, res) => {
                    if (err) done(err);
                    res.should.have.status(200);
                    chai.expect(res).to.be.json;
                    res.body.should.have.property('documents')
                        .that.is.an('array').with.lengthOf.above(0);

                    done();
                });
            })
        })
    });

    describe('POST /', () => {
        it('should add a new unnamed document', (done) => {    
            chai.request.execute(server)
                .post('/') // Change this to the correct endpoint
                .send() // Send empty body since the document is unnamed
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json; // Assert that the response is JSON
                    res.body.should.to.have.property('result')
                    .that.is.an('object').with.property('acknowledged', true,);
    
                    done();
                });
        });
    });

    describe('PUT /update', () => {
        it('should update a document', (done) => {
            // First, make a GET request to fetch the document ID
            chai.request.execute(server)
                .get("/") // Fetch the document list
                .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.should.to.be.json; // Ensure the response is JSON
                    res.body.should.have.property('documents')
                        .that.is.an('array').with.lengthOf.above(0); // Ensure the documents array is not empty
    
                    const docId = res.body.documents[0]._id; // Extract the docId from the response
    
                    // Now make a PUT request to update the document
                    chai.request.execute(server)
                        .put(`/update`) // Use the fetched docId
                        .send({ id: docId, title: 'Updated Title', content: 'Updated Content' }) // Send the update payload
                        .end((err, res) => {
                            if (err) return done(err);
                            res.should.have.status(200);
                            res.should.to.be.json; // Ensure the response is JSON
                            res.body.should.have.property('result')
                                .that.is.an('object').with.property('acknowledged', true); // Ensure the update was acknowledged
    
                            done(); // Finish the test after the PUT request
                        });
                });
            });
        });

        describe('delete /', () => {
            it('should delete a document', (done) => {   
                chai.request.execute(server)
                .get("/") // Fetch the document list
                .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.should.to.be.json; // Ensure the response is JSON
                    res.body.should.have.property('documents')
                        .that.is.an('array').with.lengthOf.above(0); // Ensure the documents array is not empty
    
                    const docId = res.body.documents[0]._id; // Extract the docId from the response 
                chai.request.execute(server)
                    .delete(`/delete/${docId}`) // Change this to the correct endpoint
                    .send() // Send empty body since the document is unnamed
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.to.be.json; // Assert that the response is JSON
                        res.body.should.to.have.property('result')
                        .that.is.an('object').with.property('acknowledged', true,);
        
                        done();
                    });
            });
        });
});
