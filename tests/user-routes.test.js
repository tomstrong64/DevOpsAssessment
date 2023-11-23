// This is tests for the user controller as it a standalone part of the app
import {} from 'dotenv/config';
import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

let auth_token; //Private authorisation stuff, should not be exposed outside!
let admin_auth_token; // for admin's authentication

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
            .get('/user/getUser')
            .set('Authorization', `Bearer ${user_auth_token}`)
            .send();
        expect(profileResponse.statusCode).toBe(200);
        expect(profileResponse.body['admin']).toBe(false);
        // This test will need to be rewritten.
    }, 25000);

    it('The admin property of a registered admin user should be true after the document is edited in the database.', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'testAdminDummy1',
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = response.body.token;

        // Request to getUser route to get this newly registered user
        const checkResponse = await request(app)
            .get('/user/getUser')
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        let ad_user_id = checkResponse.body['_id'];
        await User.updateOne({ _id: ad_user_id }, { admin: true });

        const adResponse = await request(app)
            .get('/user/getUser')
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        expect(adResponse.statusCode).toBe(200);
        expect(adResponse.body['admin']).toBe(true);
    }, 25000);
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

// Testing requests to the updateUser route, both positive and negative
describe('PUT /user/updateUser', () => {
    it('Changing the user passord of a user should return an appropriate status code with necessary details', async () => {
        const loginRequest = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail44@yahoo.com',
                password: 'jumjams1234',
            });
        auth_token = loginRequest.body.token;

        const response = await request(app)
            .put('/user/updateUser')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`)
            .send({
                email: 'testingmail44@yahoo.com',
                newpassword: 'ZmDhg&@GghDV611',
                confirmpassword: 'ZmDhg&@GghDV611',
                password: 'jumjams1234',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body['updated']).toBe(true);
        expect(response.body['message']).toEqual('Updated successfully');
        expect(response.body['redirect']).toBeDefined();
    }, 25000);
    it('Error response code should be sent back if new password and the same password entered again do not match', async () => {
        const loginRequest = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail11@yahoo.com',
                password: 'adbdfec2891',
            });
        auth_token = loginRequest.body.token;

        const response = await request(app)
            .put('/user/updateUser')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`)
            .send({
                email: 'testingmail11@yahoo.com',
                newpassword: 'xAio#8ue3N2y!G',
                confirmpassword: 'xAio#8ue',
                password: 'adbdfec2891',
            });
        expect(response.statusCode).toBe(400);
        expect(response.body['message']).toEqual('Passwords do not match');
    }, 25000);
    it('Error response code should be sent if the password field is blank when trying to update the current user details', async () => {
        const loginRequest = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dum273@gmail.com',
                password: 'luo2ry92@a1h',
            });
        auth_token = loginRequest.body.token;

        const response = await request(app)
            .put('/user/updateUser')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`)
            .send({
                email: 'dum273@gmail.com',
                newpassword: 'DJ#hKbE12dzmdqkoi1ytsv',
                confirmpassword: 'DJ#hKbE12dzmdqkoi1ytsv',
            });
        expect(response.statusCode).toBe(400);
    }, 25000);
});

describe('GET /getUser test', () => {
    it('When this route is accessed by a login user, the correct data should be sent back to the client in the response', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'test9dummymail@gmail.com',
                password: 'allu!8yGHdt#@62',
            });
        auth_token = loginResponse.body.token;

        const response = await request(app)
            .get('/user/getUser')
            .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body['admin']).toBe(false);
        expect(response.body['token']).toBeDefined();
    }, 15000);
});
