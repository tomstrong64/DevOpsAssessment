// This is tests for the user controller as it a standalone part of the app
import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import chalk from 'chalk';
import { User } from '../models/User.js';

let auth_token; //Private authorisation stuff, should not be exposed outside!

// SETUP FOR USER TEST
beforeAll( async() => {
    mongoose.connect('mongodb://admin:admin@localhost:27017/admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(
            'MongoDB connection established successfully',
            chalk.green('✓')
        );

    // Login
    const response = await request(app)
        .post('/user/login')
        .set('Content-Type', 'application/json')
        .send({
            email: "testeruser@testbed.com",
            password: "9136472085",
        });
    auth_token = response.body.token;
    console.log(response); // Debugging purposes
});

// TEARDOWN
afterAll( async() => {
    // LOGOUT
    const response = await request(app)
        .set('Authorization', `Bearer ${auth_token}`)
        .get('/user/logout')

    // Should have some code to close the connection to the database as well!
    await User.deleteMany({});
    mongoose.connection.close(); // To close the connection otherwise Jest reports the connection as open which is not good!
})

describe('POST /register', () => {
    it('should save the new user to the database', async () => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`)
            .send({
                "name": 'Test Name',
                "email": 'testingmail44@yahoo.com',
                "password": 'jumjams1234',
            });
        expect(response.status).toBe(201);  // returns 302, which is known as 'Found', it means that the URI of the requested URI has been changed temporarily
    }, 15000);

    it('the headers should be defined', async() => {
        const response = await request(app)
            .post('/user/register')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`)
            .send({
                "name": "Test Name 2",
                "email": "testingmail11@yahoo.com",
                "password": "adbdfec2891",
            });
            expect(response.headers).toBeDefined();
    }, 15000);

    it("the response code should be appropriate for this request' ", async() => {
        const response = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${auth_token}`)
        .send({
            "name": "DUMMY_Alpha",
            "email": "dum273@gmail.com",
            "password": "luo2ry92@a1h",
        });
        expect(response.statusCode).toBe(200);
    }, 15000)
});
