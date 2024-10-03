/* global it describe */
process.env.NODE_ENV = 'test';

import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import server from "../app.mjs";



const chai = chaiModule.use(chaiHttp);

chai.should();

describe('Reports', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request.execute(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });
});

describe('Documents', () => {

    // Test POST / (add new unnamed document)
    describe('POST /', () => {
        it('should add a new document and return 200 status', (done) => {
            chai.request.execute(server)
                .post('/')
                .send({}) // sending an empty object as we are adding an unnamed document
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.result.should.exist;
                    done();
                });
        });

        it('should return 500 on document addition failure', (done) => {
            // Assuming some error is thrown in document addition logic, simulate it
            chai.request.execute(server)
                .post('/')
                .send({})
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.error.should.exist;
                    done();
                });
        });
    });

    // Test PUT /update (update a document)
    describe('PUT /update', () => {
        it('should update a document and return 200 status', (done) => {
            chai.request.execute(server)
                .put('/update')
                .send({
                    id: 'document_id',
                    title: 'Updated Title',
                    content: 'Updated Content'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.result.should.exist;
                    done();
                });
        });

        it('should return 500 on document update failure', (done) => {
            // Simulate a failure in the update logic
            chai.request.execute(server)
                .put('/update')
                .send({
                    id: 'invalid_id',
                    title: 'New Title',
                    content: 'New Content'
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.message.should.equal('Error updating document bu put route');
                    done();
                });
        });
    });

    // Test DELETE /delete/:id (remove a document)
    describe('DELETE /delete/:id', () => {
        it('should delete a document and return 200 status', (done) => {
            chai.request.execute(server)
                .delete('/delete/document_id')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.result.should.exist;
                    done();
                });
        });

        it('should return 500 on document deletion failure', (done) => {
            // Simulate a failure in the delete logic
            chai.request.execute(server)
                .delete('/delete/invalid_id')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.error.should.exist;
                    done();
                });
        });
    });
});