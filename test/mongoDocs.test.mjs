/* global it describe */
process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import sinon from 'sinon';
import mongoDocs from '../remoteDocs.mjs'; // Importera funktionerna
import mongoDb from '../db/mongoDb.mjs'; // Importera för att mocka MongoDB-anslutningen

describe('MongoDocs', () => {
    let sandbox;
    let mockCollection;
    let mockClient;

    beforeEach(() => {
        // Skapa en sandbox för sinon
        sandbox = sinon.createSandbox();

        // Mocka MongoDB-collection och client
        mockCollection = { 
            find: sandbox.stub().returns({ toArray: sandbox.stub().resolves([{ title: 'Test Document' }]) }),
            updateOne: sandbox.stub().resolves({ acknowledged: true }),
            insertOne: sandbox.stub().resolves({ acknowledged: true }),
            deleteOne: sandbox.stub().resolves({ acknowledged: true }),
            findOne: sandbox.stub().resolves({ title: 'Test Document', content: 'Test Content' })
        };
        mockClient = { close: sandbox.stub().resolves() };

        // Mocka mongoDb.remoteMongo att returnera vår mockade collection och client
        sandbox.stub(mongoDb, 'remoteMongo').resolves({
            collection: mockCollection,
            client: mockClient
        });
    });

    afterEach(() => {
        // Återställ sandbox efter varje test
        sandbox.restore();
    });

    // Test för getAll
    it('should retrieve all documents', async () => {
        const docs = await mongoDocs.getAll();
        expect(docs).to.be.an('array');
        expect(docs[0]).to.have.property('title', 'Test Document');
        sinon.assert.calledOnce(mockCollection.find); // Kontrollera att find anropades
    });

    // Test för updateOne
    it('should update a document', async () => {
        const result = await mongoDocs.updateOne('607f1f77bcf86cd799439011', 'Updated Title', 'Updated Content');
        expect(result).to.have.property('acknowledged', true);
        sinon.assert.calledOnce(mockCollection.updateOne); // Kontrollera att updateOne anropades
    });

    // Test för addNew
    it('should add a new document', async () => {
        const result = await mongoDocs.addNew();
        expect(result).to.have.property('acknowledged', true);
        sinon.assert.calledOnce(mockCollection.insertOne); // Kontrollera att insertOne anropades
    });

    // Test för removeById
    it('should remove a document by id', async () => {
        const result = await mongoDocs.removeById('607f1f77bcf86cd799439011');
        expect(result).to.have.property('acknowledged', true);
        sinon.assert.calledOnce(mockCollection.deleteOne); // Kontrollera att deleteOne anropades
    });

    // Test för getByID
    it('should get a document by id', async () => {
        const doc = await mongoDocs.getByID('607f1f77bcf86cd799439011');
        expect(doc).to.have.property('title', 'Test Document');
        sinon.assert.calledOnce(mockCollection.findOne); // Kontrollera att findOne anropades
    });
});
