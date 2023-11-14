import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';

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
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send({
            email: "testeruser@testbed.com",
            password: "9136472085",
        });
    auth_token = response.body.token;
});

describe('POST /pois/addPoi', () => {
    it('should add new POI', async () => {
        const response = await request(app)
            .post('/pois/addPoi')
            .send({
                name: 'Test POI',
                type: 'Test Type',
                country: 'Test Country',
                region: 'Test Region',
                lat: 123.45,
                lon: 67.89,
                description: 'Test Description',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`);
        expect(response.headers['Content-Type']).toBeUndefined();
        expect(response.status).toBe(201);
    }, 10000);
});
