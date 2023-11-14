// This is tests for the user controller as it a standalone part of the app
import app from '../app.js';
import request from 'supertest';

describe('POST /register', () => {
    it('should save the new user to the database', async () => {
        const response = await request(app)
            .post('/user/register')
            .send({
                "name": 'Test Name',
                "email": 'testingmail44@yahoo.com',
                "password": 'jumjams1234',
            })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(201);  // returns 302, which is known as 'Found', it means that the URI of the requested URI has been changed temporarily
    }, 60000);

    it('the headers should be defined', async() => {
        const response = await request(app)
            .post('/user/register')
            .send({
                "name": "Test Name 2",
                "email": "testingmail11@yahoo.com",
                "password": "adbdfec2891",
            })
            .set('Content-Type', 'application/json');
            expect(response.headers).toBeDefined();
    }, 60000);

    it("the response code should be appropriate for this request' ", async() => {
        const response = await request(app)
        .post('/user/register')
        .send({
            "name": "DUMMY_Alpha",
            "email": "dum273@gmail.com",
            "password": "luo2ry92@a1h",
        })
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200);
    }, 60000)
});