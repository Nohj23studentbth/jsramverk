// /* global it describe */
process.env.NODE_ENV = 'test';

import * as chaiModule from "chai"; // fingerar inte med enkelt import pga js-filer i chai
import chaiHttp from "chai-http";
import {server} from "../app.mjs"; // det finns inte defoult export

const chai = chaiModule.use(chaiHttp);

chai.should();

// test för incomst router
describe('Reports', () => {
    describe('GET /', () => {
        it('TEST IF 200 ON APP GET', (done) => {
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