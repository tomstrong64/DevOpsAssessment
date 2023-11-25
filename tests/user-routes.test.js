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
});
