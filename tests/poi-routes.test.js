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
let admin2Token;

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
    //Create newuser
    const RegisterNewUserResponse = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .send({
            name: 'Admin',
            email: 'admin1@gmail.com',
            password: 'admin1password',
        });

    // Log in the user to get the token
    const adminResponse = await request(app)
        .post('/user/login')
        .set('Content-Type', 'application/json')
        .send({
            email: 'admin1@gmail.com',
            password: 'admin1password',
        });
    admin1Token = adminResponse.body.token;
    const newUserAdmin = await request(app)
        .get('/user/getUser')
        .set('Authorization', `Bearer ${admin1Token}`);
    const adminID = newUserAdmin.body._id;
    //update a user to be an  Admin
    await User.updateOne({ _id: adminID }, { admin: true });

    //creating another user to assign it as second admin
    //Create newuser
    const RegistersecondNewUserResponse = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .send({
            name: 'Admin',
            email: 'admin2@gmail.com',
            password: 'admin2password',
        });

    // Log in the user to get the token
    const admin2Response = await request(app)
        .post('/user/login')
        .set('Content-Type', 'application/json')
        .send({
            email: 'admin2@gmail.com',
            password: 'admin2password',
        });
    admin2Token = admin2Response.body.token;
    const newsecondUserAdmin = await request(app)
        .get('/user/getUser')
        .set('Authorization', `Bearer ${admin1Token}`);
    const admin2ID = newsecondUserAdmin.body._id;
    //update a user to be an  Admin
    await User.updateOne({ _id: admin2ID }, { admin: true });
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

    it('Normal User should not be able to delete someone elses POI (404)', async () => {
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
        admin1_poiID = admin1PoiResponse.body.poi._id;
        console.log(admin1_poiID);
        const response = await request(app)
            .delete(`/pois/deletePoi/${admin1_poiID}`)
            .set('Authorization', `Bearer ${auth_token}`);
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({ message: 'POI not found' });
    });
});

it('Admin user should not be able to delete someone elses POI (403)', async () => {
    const normalUserPoiResponse = await request(app)
        .post('/pois/addPoi')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${auth_token}`)
        .send({
            name: 'normal user POI',
            type: 'Test Type',
            country: 'London1',
            region: 'Solent',
            lat: 50.9105,
            lon: -14.4049,
            description: 'Test Description normal user',
        });

    const User_poiID = normalUserPoiResponse.body.poi._id;
    const response = await request(app)
        .delete(`/pois/deletePoi/${User_poiID}`)
        .set('Authorization', `Bearer ${admin1Token}`);
    expect(response.status).toEqual(403);
    expect(response.body).toEqual({ message: 'Forbidden' });
});

test.todo('User should not be able to delete non existent POI (404)');

test.todo('User should not be able to delete POI by invalid ID (400)');

test.todo('Admin should be able to delete any Users POI (200)');

test.todo('Admin should not be able to delete another Admins POI (403)');

test.todo('User should not be able to delete non existent POI (404)');
test.todo('Admin should not be able to delete POI by invalid ID (400)');
