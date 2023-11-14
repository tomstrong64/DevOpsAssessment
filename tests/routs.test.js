import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import chalk from 'chalk';
import { POI } from '../models/Poi.js';

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

    // Register a user first, as Git Actions will create a new database each time!
    const response = await request(app)
        .post('user/register')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${auth_token}`)
        .send({
            name: "Default User Tester",
            email: "testeruser@testbed.com",
            password: "9136472085",
        })
    auth_token = response.body.token;
});

// TEARDOWN
afterAll( async() => {
    // LOGOUT
    const response = await request(app)
        .set('Authorization', `Bearer ${auth_token}`)
        .get('/user/logout')

    // Should have some code to close the connection to the database as well!
    await POI.deleteMany({});
    mongoose.connection.close(); // To close the connection otherwise Jest reports the connection as open which is not good!
})

describe('POST /pois/addPoi', () => {
    it('should add new POI', async () => {
        const response = await request(app)
        .post('/pois/addPoi')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${auth_token}`)
        .send({
            "name": 'Test POI',
            "type": 'Test Type',
            "country": 'Test Country',
            "region": 'Test Region',
            "lat": 123.45,
            "lon": 67.89,
            "description": 'Test Description',
        });
        expect(response.headers['Content-Type']).toBeUndefined();
        expect(response.status).toBe(201);
    });
});
