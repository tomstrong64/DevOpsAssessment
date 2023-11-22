import {} from 'dotenv/config';
import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { POI } from '../models/Poi.js';

let auth_token;
let poi_region;
let poi_id;
let user_id;
let admin1;
let admin1_poiID;
let admin1Token;

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
            name: 'POI Test User',
            email: 'poi@test.com',
            password: '12345',
        });
    auth_token = response.body.token;
    //Create Admin user
    const adminUser = new User({
        name: 'Admin User1',
        email: 'admin1@gmail.com',
        password: 'admin1password',
        admin: true,
    });
    await adminUser.save();
    // Log in the admin user to get the token
    const adminResponse = await request(app)
        .post('/user/login')
        .set('Content-Type', 'application/json')
        .send({
            email: 'admin1@gmail.com',
            password: 'admin1password',
        });
    admin1Token = adminResponse.body.token;
});

// TEARDOWN
afterAll(async () => {
    // LOGOUT
    const response = await request(app)
        .get('/user/logout')
        .set('Authorization', `Bearer ${auth_token}`)
        .send();

    // Should have some code to close the connection to the database as well!
    await POI.deleteMany({});
    await User.deleteMany({});
    mongoose.connection.close(); // To close the connection otherwise Jest reports the connection as open which is not good!
});

describe('POST /pois/addPoi', () => {
    it('should add new POI', async () => {
        const response = await request(app)
            .post('/pois/addPoi')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${auth_token}`)
            .send({
                name: 'Swindon',
                type: 'Test Type',
                country: 'London1',
                region: 'Solent',
                lat: 50.9105,
                lon: -1.4049,
                description: 'Test Description',
            });
        poi_id = response.body.poi._id;
        poi_region = response.body.poi.region;

        expect(response.status).toEqual(201);
    });
});

describe('GET /pois/list?search=poi_region', () => {
    it('should return POIs by region name', async () => {
        const response = await request(app)
            .get(`/pois/list?search=${poi_region}`)
            .set('Authorization', `Bearer ${auth_token}`);

        expect(response.status).toEqual(200);
    });
});
it('should return all POIs when no query parameters are provided', async () => {
    const response = await request(app)
        .get('/pois/list')
        .set('Authorization', `Bearer ${auth_token}`);

    expect(response.status).toEqual(200);
    expect(typeof response.body).toBe('object');
});

describe('GET /poi/id ', () => {
    it('should return a single POI by ID', async () => {
        const response = await request(app)
            .get(`/pois/${poi_id}`)
            .set('Authorization', `Bearer ${auth_token}`);

        expect(response.status).toEqual(200);
        expect(response.body._id).toEqual(poi_id);
    });
});
describe('DELETE /pois/deletePoi/:id', () => {
    it('User should be able to delete their own POI (200)', async () => {
        const response = await request(app)
            .delete(`/pois/deletePoi/${poi_id}`)
            .set('Authorization', `Bearer ${auth_token}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ message: 'POI successfully deleted' });
    });

    it('User should not be able to delete someone elses POI (403)', async () => {
        console.log('Token', admin1Token);
        const admin1PoiResponse = await request(app)
            .post('/pois/addPoi')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin1Token}`)
            .send({
                name: 'Admin 1 POI',
                type: 'Test Type',
                country: 'London1',
                region: 'Solent',
                lat: 50.9105,
                lon: -14.4049,
                description: 'Test Description Admin 1',
            });
        const POI1 = admin1PoiResponse.body;
        console.log('POI:', POI1);
        admin1_poiID = admin1PoiResponse.body._id;
        const response = await request(app)
            .delete(`/pois/deletePoi/${admin1_poiID}`)
            .set('Authorization', `Bearer ${auth_token}`);
        expect(response.status).toEqual(403);
    });
});

test.todo('User should not be able to delete non existent POI (404)');

test.todo('User should not be able to delete POI by invalid ID (400)');

test.todo('Admin should be able to delete any Users POI (200)');

test.todo('Admin should not be able to delete another Admins POI (403)');

test.todo('User should not be able to delete non existent POI (404)');
test.todo('Admin should not be able to delete POI by invalid ID (400)');
