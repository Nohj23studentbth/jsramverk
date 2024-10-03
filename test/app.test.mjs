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

