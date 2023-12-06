/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This is tests for the user controller as it a standalone part of the app
import {} from 'dotenv/config';
import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

let auth_token; //Private authorisation stuff, should not be exposed outside!
let admin_auth_token; // for admin's authentication
let glob_user_id_for_del; // For delete user tests
let specific_user_id; // for storing the id of a non-admin user for testing deletion by another non-admin user.

// SETUP FOR USER TEST
beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, {
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

// Tests for registering a new user, both positive and negative
describe('POST /user/register', () => {
    it('A new user should be saved to the database', async () => {
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

    it('The headers should be defined in the response from the server when a user is registered for the first time', async () => {
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

    it('A newly-registered user should be redirected to the login page after registration', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'DUMMY_Alpha',
                email: 'dum273@gmail.com',
                password: 'luo2ry92@a1h',
            });
        expect(response.statusCode).toBe(201);
        expect(response.body['redirect']).toEqual('/');
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
            .set('Authorization', `Bearer ${user_auth_token}`);
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

    it('Missing the name field for a new user should return an error status code', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                email: 'test7dummail@outlook.com',
                password: 'jhriqu#H2t89',
            });
        expect(response.statusCode).toBe(400);
    }, 15000);

    it('Missing the email field for a new user should return an error status code', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'test7',
                password: 'K2y8egh^35gh@',
            });
        expect(response.statusCode).toBe(400);
    }, 15000);

    it('Missing the password field for a new user should return an error status code', async () => {
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

// Tests for the login route by both admins and non-admins, both positive and negative
describe('POST /user/login tests', () => {
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

    it('Missing email field in request body should return an error code of 400', async () => {
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

    it('Missing password field in request body should return an error code of 400', async () => {
        const response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail44@yahoo.com',
            });
        expect(response.statusCode).toBe(400);
        expect(response.body['message']).toEqual('Email and password required');
    }, 15000);

    it('Mismatched email in request body should return error 401', async () => {
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

    it('Mismatched password in request body should return error 401', async () => {
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

    it('If no auth token is provided in the request, the server should send back a status code of 401', async () => {
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
            .send({
                email: 'dum273@gmail.com',
                newpassword: 'DJ#hKbE12dzmdqkoi1ytsv',
                confirmpassword: 'DJ#hKbE12dzmdqkoi1ytsv',
                password: 'luo2ry92@a1h',
            });
        expect(response.statusCode).toBe(401);
        expect(response.body['message']).toEqual('Unauthorized');
    }, 20000);
});

// Tests for a user attempting to view their details, both positive and negative
describe('GET /user/getUser test', () => {
    it('When this route is accessed by a logged-in user, the correct data should be sent back to the client in the response', async () => {
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

    it('If auth token is not sent in the request, the server should send back a status code of 401', async () => {
        const loginresponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dum273@gmail.com',
                password: 'luo2ry92@a1h',
            });
        auth_token = loginresponse.body.token;

        const response = await request(app).get('/user/getUser');

        expect(response.statusCode).toBe(401);
        expect(response.body['message']).toEqual('Unauthorized');
    }, 15000);
});

// Tests for the admin getting a list of users, both positive and negative
describe('GET /user/list test using admin account', () => {
    it('Check that the method returns a list of users, whether it is an empty list or whether it contains some users', async () => {
        const login_response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = login_response.body.token;

        const response = await request(app)
            .get('/user/list')
            .set('Authorization', `Bearer ${admin_auth_token}`);
        specific_user_id = response.body[0]['_id']; // This is to be used for deleting one user by another user who isn't an admin
        console.log(response);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(6);
    }, 25000);

    it('If no auth token is provided to this route, the server should respond back with status code of 401', async () => {
        const logResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmin93@outlook.com',
                password: 'janfhb*@ybd37G!',
            });
        admin_auth_token = logResponse.body.token;

        const failreponse = await request(app).get('/user/list');

        expect(failreponse.statusCode).toBe(401);
        expect(failreponse.body['message']).toEqual('Unauthorized');
    }, 15000);
});

// Tests for updating a user to an admin, both positive and negative
describe('PUT /user/updateUser/:id tests', () => {
    it('Updating a user status to admin should return a HTTP status code of 200 and other associated data', async () => {
        // Register a new user first and set it to admin using the admin's route
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .send({
                name: 'testAdminDummy2',
                email: 'dummyAdmin93@outlook.com',
                password: 'janfhb*@ybd37G!',
            });
        auth_token = response.body.token;

        const checkResponse = await request(app)
            .get('/user/getUser')
            .set('Authorization', `Bearer ${auth_token}`);
        let dummy_user_id = checkResponse.body['_id'];

        const ad_loginResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = ad_loginResponse.body.token;

        const adResponse = await request(app)
            .put(`/user/updateUser/${dummy_user_id}`)
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        expect(adResponse.statusCode).toBe(200);
        expect(adResponse.body['message']).toEqual('User Updated successfully');
        expect(adResponse.body['redirect']).toBeDefined();
    }, 25000);

    it('Attempting to update an already admin user should send back status code 403', async () => {
        const adUser_response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmin93@outlook.com',
                password: 'janfhb*@ybd37G!',
            });
        admin_auth_token = adUser_response.body.token;

        const listResponse = await request(app)
            .get('/user/list')
            .set('Authorization', `Bearer ${admin_auth_token}`);
        let admin_check_id = listResponse.body[5]['_id'];
        console.log(admin_check_id);

        const adResponse = await request(app)
            .put(`/user/updateUser/${admin_check_id}`)
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        expect(adResponse.statusCode).toBe(403);
        expect(adResponse.body['message']).toEqual(
            'cannot update an admin user.'
        );
    }, 25000);

    it('Attempting to the update the status of a user with an invalid id should return a status code of 400', async () => {
        const ad_loginResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = ad_loginResponse.body.token;

        let invalid_id = 'znxbvc28'; // Having an invalid string to check response from the server

        const adResponse = await request(app)
            .put(`/user/updateUser/${invalid_id}`)
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        expect(adResponse.statusCode).toBe(400);
        expect(adResponse.body['message']).toEqual('Invalid ID');
    }, 25000);

    it('If no auth token is provided in the request, the server should send back a status code of 401', async () => {
        const ad_loginResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = ad_loginResponse.body.token;

        const listResponse = await request(app)
            .get('/user/list')
            .set('Authorization', `Bearer ${admin_auth_token}`);
        let user_check_id = listResponse.body[0]['_id'];

        const adResponse = await request(app).put(
            `/user/updateUser/${user_check_id}`
        );
        expect(adResponse.statusCode).toBe(401);
        expect(adResponse.body['message']).toEqual('Unauthorized');
    }, 25000);
});

// Tests for deleting a user, both positive and negative
describe('DELETE /user/deleteUser/:id tests', () => {
    it('An admin user should be able to successfully delete their data from the application by deleting their user account', async () => {
        const loginresponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = loginresponse.body.token;

        const checkResponse = await request(app)
            .get('/user/list')
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        glob_user_id_for_del = checkResponse.body[1]['_id'];

        const deleteResponse = await request(app)
            .delete(`/user/deleteUser?id=${glob_user_id_for_del}`)
            .set('Authorization', `Bearer ${admin_auth_token}`);
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body['message']).toEqual(
            'User Deleted successfully'
        );
    }, 20000);

    it('If an admin user tries to delete another admin user, server should respond with status code 403', async () => {
        const logResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmin93@outlook.com',
                password: 'janfhb*@ybd37G!',
            });
        admin_auth_token = logResponse.body.token;

        const checkResponse = await request(app)
            .get('/user/list')
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        // Get other admin's user id for testing
        glob_user_id_for_del = checkResponse.body[5]['_id'];

        const delresponse = await request(app)
            .delete(`/user/deleteUser?id=${glob_user_id_for_del}`)
            .set('Authorization', `Bearer ${admin_auth_token}`);
        expect(delresponse.statusCode).toBe(403);
    }, 20000);

    it('If a user tries to delete another user, the server should respond with status code 404', async () => {
        const log_response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'test9dummymail@gmail.com',
                password: 'allu!8yGHdt#@62',
            });
        auth_token = log_response.body.token;

        const fail_delResponse = await request(app)
            .delete(`/user/deleteUser?id=${specific_user_id}`)
            .set('Authorization', `Bearer ${auth_token}`);
        expect(fail_delResponse.statusCode).toBe(404);
        expect(fail_delResponse.body['message']).toEqual('not found.');
    }, 20000);

    it('If an invalid ID is sent to this route, the server should respond with a status code of 400', async () => {
        const login_response = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = login_response.body.token;

        let invalid_userID = 'nccbwgy26';

        const delresponse = await request(app)
            .delete(`/user/deleteUser?id=${invalid_userID}`)
            .set('Authorization', `Bearer ${admin_auth_token}`);
        expect(delresponse.statusCode).toBe(400);
        expect(delresponse.body['message']).toEqual('Invalid ID');
    }, 20000);

    it('If no auth token is provided in the request, the server should send back a status code of 401', async () => {
        const logResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmin93@outlook.com',
                password: 'janfhb*@ybd37G!',
            });
        admin_auth_token = logResponse.body.token;

        const checkResponse = await request(app)
            .get('/user/list')
            .set('Authorization', `Bearer ${admin_auth_token}`)
            .send();
        // Get other admin's user id for testing
        glob_user_id_for_del = checkResponse.body[5]['_id'];

        const deleteResponse = await request(app).delete(
            `/user/deleteUser?id=${glob_user_id_for_del}`
        );
        expect(deleteResponse.statusCode).toBe(401);
        expect(deleteResponse.body['message']).toEqual('Unauthorized');
    }, 20000);

    it('If an user tries to delete their own account, the server should send status code 200 with a redirect', async () => {
        const logResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'test9dummymail@gmail.com',
                password: 'allu!8yGHdt#@62',
            });
        auth_token = logResponse.body.token;

        const deleteNormalresponse = await request(app)
            .delete('/user/deleteUser')
            .set('Authorization', `Bearer ${auth_token}`);
        expect(deleteNormalresponse.statusCode).toBe(200);
        expect(deleteNormalresponse.body['redirect']).toBeDefined();
    }, 20000);
    // This last test doesn't work if implemented. A user cannot delete their own account off of the application as code 401 is returned
});

// Tests for logging out, both positive and negative
describe('GET /user/logout test', () => {
    it('A user should be able to successfully log out once they are logged in, with status code 200 being returned', async () => {
        const loginresponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'user@test.com',
                password: '12345',
            });
        auth_token = loginresponse.body.token;

        const logoutResponse = await request(app)
            .get('/user/logout')
            .set('Authorization', `Bearer ${auth_token}`);
        expect(logoutResponse.statusCode).toBe(200);
        expect(logoutResponse.body['message']).toEqual('Logout successful');
        expect(logoutResponse.body['redirect']).toBeDefined();
    }, 15000);

    it('An admin user should also be able to successfully log out after they are logged in, with status code 200 being returned', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'dummyAdmins82@outlook.com',
                password: 'Akn#Rcjy7!',
            });
        admin_auth_token = loginResponse.body.token;

        const logoutresponse = await request(app)
            .get('/user/logout')
            .set('Authorization', `Bearer ${admin_auth_token}`);
        expect(logoutresponse.statusCode).toBe(200);
        expect(logoutresponse.body['message']).toEqual('Logout successful');
        expect(logoutresponse.body['redirect']).toBeDefined();
    }, 20000);

    it('If no auth token is provided in the request, the server should send back a status code of 401', async () => {
        const loginresponse = await request(app)
            .post('/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'testingmail11@yahoo.com',
                password: 'adbdfec2891',
            });
        auth_token = loginresponse.body.token;

        const logoutResponse = await request(app).get('/user/logout');
        expect(logoutResponse.statusCode).toBe(401);
        expect(logoutResponse.body['message']).toEqual('Unauthorized');
    }, 15000);
});
