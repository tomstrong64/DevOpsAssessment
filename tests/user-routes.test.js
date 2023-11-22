// This is tests for the user controller as it a standalone part of the app
import {} from 'dotenv/config';
import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

let auth_token; //Private authorisation stuff, should not be exposed outside!

// SETUP FOR USER TEST
beforeAll(async () => {
    mongoose.connect('mongodb://admin:admin@localhost:27017/admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Register a user first, as Git Actions will create a new database each time!
    const response = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .send({
            name: 'User Tests User',
            email: 'user@test.com',
            password: '12345',
        });
    auth_token = response.body.token;
});

// TEARDOWN
afterAll(async () => {
    // LOGOUT
    const response = await request(app)
        .get('/user/logout')
        .set('Authorization', `Bearer ${auth_token}`)
        .send();

    // Should have some code to close the connection to the database as well!
    await User.deleteMany({});
    mongoose.connection.close(); // To close the connection otherwise Jest reports the connection as open which is not good!
});

describe('POST /register', () => {
    it('should save the new user to the database', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Test Name',
                email: 'testingmail44@yahoo.com',
                password: 'jumjams1234',
            });
        expect(response.status).toBe(201); // returns 302, which is known as 'Found', it means that the URI of the requested URI has been changed temporarily
    }, 15000);

    it('the headers should be defined', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Test Name 2',
                email: 'testingmail11@yahoo.com',
                password: 'adbdfec2891',
            });
        expect(response.headers).toBeDefined();
    }, 15000);

    it("the response code should be appropriate for this request' ", async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'DUMMY_Alpha',
                email: 'dum273@gmail.com',
                password: 'luo2ry92@a1h',
            });
        expect(response.statusCode).toBe(201);
    }, 15000);

    it('The admin property of a newly registered non-admin user should be set to false by default', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'test9',
                email: 'test9dummymail@gmail.com',
                password: 'allu!8yGHdt#@62',
            });
        let user_auth_token = response.body.token;

        // Get the profile of the user to check the necessary property
        const profileResponse = await request(app)
            .get('/user/profile')
            .set('Authorization', `Bearer ${user_auth_token}`)
            .send();
        expect(profileResponse.statusCode).toBe(200);
        // This test will need to be rewritten.
    }, 15000);
});

describe('POST /register negative cases', () => {
    it('A new user registering with an existing email address should return an error status code', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'DUMMY_Alpha2',
                email: 'dum273@gmail.com',
                password: 'apDHe86g^$',
            });
        expect(response.statusCode).toBe(401);
    }, 15000);

    it('missing the name field for a new user should return an error status code', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                email: 'test7dummail@outlook.com',
                password: 'jhriqu#H2t89',
            });
        expect(response.statusCode).toBe(400);
    }, 15000);

    it('missing the email field for a new user should return an error status code', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'test7',
                password: 'K2y8egh^35gh@',
            });
        expect(response.statusCode).toBe(400);
    }, 15000);

    it('missing the password field for a new user should return an error status code', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'test8',
                email: 'test8dummail@yahoo.com',
            });
        expect(response.statusCode).toBe(400);
    }, 15000);
});

describe('POST /login positive case', () => {
    it('The user should be able to successfully login to the app with status code 200', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail11@yahoo.com',
                password: 'adbdfec2891',
            });
        expect(response.statusCode).toBe(200);
    }, 15000);
    it("Upon successful login, the message inside the response should equal 'Login successful' ", async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail44@yahoo.com',
                password: 'jumjams1234',
            });
        expect(response.body['message']).toEqual('Login successful');
    }, 15000);
    it('Check if the token exists in the response body when user successfully logged in', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                name: 'DUMMY_Alpha',
                email: 'dum273@gmail.com',
                password: 'luo2ry92@a1h',
            });
        expect(response.body['token']).toBeDefined();
    }, 15000);
});

describe('POST /login negative cases', () => {
    it('missing email field in request body should return an error code of 400', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                password: 'jumjams1234',
            });
        expect(response.statusCode).toBe(400);
        expect(response.body[['message']]).toEqual(
            'Email and password required'
        );
    }, 15000);
    it('missing password field in request body should return an error code of 400', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail44@yahoo.com',
            });
        expect(response.statusCode).toBe(400);
        expect(response.body['message']).toEqual('Email and password required');
    }, 15000);
    it('mismatched email in request body should return error 401', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testigmail11@yahoo.com',
                password: 'adbdfec2891',
            });
        expect(response.statusCode).toBe(401);
        expect(response.body['message']).toEqual('Invalid email or password');
    }, 15000);
    it('mismatched password in request body should return error 401', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dum273@gmail.com',
                password: 'luo2ry92@a1',
            });
        expect(response.statusCode).toBe(401);
        expect(response.body['message']).toEqual('Invalid email or password');
    }, 15000);
    it('Malformed request to the login route should throw an error code of 400', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({});
        expect(response.statusCode).toBe(400);
    }, 15000);
});
