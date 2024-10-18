// process.env.NODE_ENV = 'test';

// import request from 'supertest'; // Import supertest for HTTP requests
// import { server } from '../../app.mjs';

// // Test for incoming router
// describe('Reports', () => {
    
//     describe('GET /', () => {
//         it('should have status 200', async () => {  
//             const res = await request(server)
//                 .get('/'); // Your endpoint to fetch documents

//             console.log(res.body, res.statusCode, res.status)
//             expect(res.status).toBe(200); // Check for HTTP status 200
//             expect(res.body).toBeDefined(); // Ensure response body is defined
//             // expect(res.body).toHaveProperty('documents'); // Check for 'documents' property
//             // expect(res.body.documents).toBeInstanceOf(Array); // Check that 'documents' is an array
//             // expect(res.body.documents.length).toBeGreaterThan(0); // Ensure the documents array is not empty
//         });

//     });

//     describe('POST /', () => {
//         it('should add a new unnamed document', async () => {    
//             const res = await request(server)
//                 .post('/') // Change this to the correct endpoint
//                 .send(); // Send empty body since the document is unnamed

//             expect(res.status).toBe(200); // Check for HTTP status 200
//             expect(res.body).toBeDefined(); // Ensure response body is defined
//             expect(res.body).toHaveProperty('result');
//             expect(res.body.result).toHaveProperty('acknowledged', true); // Check acknowledgment
//         });
//     });

//     describe('PUT /update', () => {
//         it('should update a document', async () => {
//             // First, make a GET request to fetch the document ID
//             const getRes = await request(server)
//                 .get('/'); // Fetch the document list

//             expect(getRes.status).toBe(200); // Check for HTTP status 200
//             expect(getRes.body).toHaveProperty('documents'); // Check for 'documents' property
//             expect(getRes.body.documents).toBeInstanceOf(Array); // Ensure it's an array
//             expect(getRes.body.documents.length).toBeGreaterThan(0); // Ensure it's not empty

//             const docId = getRes.body.documents[0]._id; // Extract the docId from the response

//             // Now make a PUT request to update the document
//             const putRes = await request(server)
//                 .put('/update') // Use the correct endpoint
//                 .send({ id: docId, title: 'Updated Title', content: 'Updated Content' }); // Send the update payload

//             expect(putRes.status).toBe(200); // Check for HTTP status 200
//             expect(putRes.body).toHaveProperty('result'); // Check for 'result' property
//             expect(putRes.body.result).toHaveProperty('acknowledged', true); // Ensure the update was acknowledged
//         });
//     });

//     describe('DELETE /delete', () => {
//         it('should delete a document', async () => {   
//             const getRes = await request(server)
//                 .get('/'); // Fetch the document list

//             expect(getRes.status).toBe(200); // Check for HTTP status 200
//             expect(getRes.body).toHaveProperty('documents'); // Check for 'documents' property
//             expect(getRes.body.documents).toBeInstanceOf(Array); // Ensure it's an array
//             expect(getRes.body.documents.length).toBeGreaterThan(0); // Ensure it's not empty

//             const docId = getRes.body.documents[0]._id; // Extract the docId from the response 

//             const deleteRes = await request(server)
//                 .delete(`/delete/${docId}`) // Use the correct endpoint
//                 .send(); // Send empty body since the document is unnamed

//             expect(deleteRes.status).toBe(200); // Check for HTTP status 200
//             expect(deleteRes.body).toHaveProperty('result'); // Check for 'result' property
//             expect(deleteRes.body.result).toHaveProperty('acknowledged', true); // Ensure acknowledgment
//         });
//     });

//     afterAll((done) =>{
//         server.close(done);
//     })
// });
