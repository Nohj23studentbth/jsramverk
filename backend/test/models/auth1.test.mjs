/* global it describe before */

process.env.NODE_ENV = 'test';

// import { parse } from 'node-html-parser';
// import request from 'supertest'; // use supertest for HTTP requests
// import server from '../../app.mjs';
// //import db from '../../db/mongo/mongoDb.mjs';

// let apiKey = '';

// describe('auth', () => {

//   describe('GET /api_key', () => {
//         it('200 HAPPY PATH getting form', async () => {
//         const res = await request(server).get('/api_key');
//         expect(res.status).toBe(200);
//         });

//         it('should get 200 as we get apiKey', async () => {
//         const user = {
//             email: 'test@auth.com',
//             gdpr: 'gdpr',
//         };

//         const res = await request(server)
//             .post('/api_key/confirmation')
//             .send(user);

//         expect(res.status).toBe(200);
//         expect(typeof res.text).toBe('string');

//         const HTMLResponse = parse(res.text);
//         const apiKeyElement = HTMLResponse.querySelector('#apikey');
//         expect(apiKeyElement).toBeInstanceOf(Object);

//         apiKey = apiKeyElement.childNodes[0].rawText;
//         expect(apiKey.length).toBe(32);
//         });

//     })

//     afterAll((done) =>{
//         server.close(done);
//     })
    
// })
