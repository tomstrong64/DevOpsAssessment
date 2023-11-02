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
        expect(response.headers['Content-Type']).toBeUndefined();
        expect(response.status).toBe(201);
    }, 10000);
});
