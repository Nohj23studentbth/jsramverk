// auth.test.js
import auth from '../../models/auth.mjs';
import getDb from '../../db/mongo/mongoDb.mjs';
// import bcrypt from 'bcryptjs';
// import webtoken from 'jsonwebtoken';
// import data from '../../models/data.mjs';

// Setup some mock environment variables for tests if needed
process.env.JWT_SECRET = 'test_secret_key';

describe('Auth Module', () => {
    let mockReq, mockRes, dbMock;
    let collection;
    let database;

    beforeAll(async () => {
        // Mock the request and response objects
        mockReq = {
            name: 'Olga Egorova',
            password: 'jo.e@example.com',
        };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        };

        // // Mock DB connection
        // dbMock = {
        //     collection: {
        //         findOne: jest.fn(),
        //     },
        //     client: {
        //         close: jest.fn(),
        //     }
        // };

        database = await getDb.connect();
        

        // // Mock the DB connection to return the mock DB
        // jest.spyOn(getDb, 'connect').mockResolvedValue(dbMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async(done) => {
        await database.client.close();
    })

    test('login - should return user login success', async () => {
        //const user = 

        // Simulate a user existing in the database
        //dbMock.collection.findOne.mockResolvedValue(user);

        // Run the login function
        await auth.login({
            name: 'Olga Egorova',
            password: 'jo.e@example.com',
        }, mockRes);

        // Assert the expected status code and response
        expect(mockRes.status).not.toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                type: 'success',
                message: 'User logged in',
                user: expect.any(Object),
                // token: expect.any(String)
            }
        });
    });

    // test('login - should return 401 if user not found', async () => {
    //     // Simulate no user found in the database
    //     dbMock.collection.findOne.mockResolvedValue(null);

    //     await auth.login(mockReq, mockRes);

    //     expect(mockRes.status).toHaveBeenCalledWith(401);
    //     expect(mockRes.json).toHaveBeenCalledWith({
    //         errors: {
    //             status: 401,
    //             source: '/login',
    //             title: 'User not found',
    //             detail: 'User with provided email not found.'
    //         }
    //     });
    // });

    test('comparePasswords - should return success if passwords match', async () => {
        const user = {
            email: 'testuser@example.com',
            password: 'testpassword',  // Plain password for testing purposes
            //apiKey: 'someapikey',
        };

        // Run the comparePasswords function
        //await auth.comparePasswords(mockRes, 'testpassword', user);

        await auth.comparePasswords()
        // Assert that the response is correct
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                type: 'success',
                message: 'User logged in',
                user: expect.any(Object),
                //token: expect.any(String)
            }
        });
    });

    test('comparePasswords - should return 401 if passwords do not match', async () => {
        const user = {
            email: 'testuser@example.com',
            password: 'anotherpassword',  // Different password
        };

        await auth.comparePasswords(mockRes, 'testpassword', user);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            errors: {
                status: 401,
                source: '/login',
                title: 'Wrong password',
                detail: 'Password is incorrect.'
            }
        });
    });
});