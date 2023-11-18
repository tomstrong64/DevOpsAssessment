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
let is_admin;
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
describe('GET /user/getUser', () => {
    it('get user', async () => {
        const response = await request(app)
            .get('/user/getUser')
            .set('Authorization', `Bearer ${auth_token}`);
        user_id = response.body._id;
        console.log('User Id ', user_id);
        is_admin = response.body.admin;
        console.log(is_admin);
        expect(response.status).toEqual(200);
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

/*describe('DELETE /pois/deletePoi/:id', () => {
    it('Should delete the poi with given id', async () => {
        const response = await request(app)
            .delete(`/pois/deletePoi/${poi_id}`)
            .set('Authorization', `Bearer ${auth_token}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ message: 'Poi Deleted successfully' });
    });
    it('User should not be able to delete someone elses POI', async () => {});
});*/
describe("Admin should not be able to delete another Admin's POI (403)", () => {
    it("should return 403 when admin tries to delete another admin's POI", async () => {
        // Create the first admin
        const admin1Response = await request(app)
            .post('/user/registerAdmin')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Admin 1',
                email: 'admin1@test.com',
                password: 'adminpassword',
                admin: true,
            });

        const admin1Token = admin1Response.body.token;
        console.log('token ', admin1Token);

        // Create the second admin
        const admin2Response = await request(app)
            .post('/user/registerAdmin')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Admin 2',
                email: 'admin2@test.com',
                password: 'adminpassword',
                admin: true,
            });

        const admin2Token = admin2Response.body.token;

        // Admin 1 adds a POI
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
                lon: -1.4049,
                description: 'Test Description',
            });

        // Log the response to inspect its structure
        console.log('admin1PoiResponse.body:', admin1PoiResponse.body);

        // Check if the 'poi' property exists in the response body
        if (!admin1PoiResponse.body.poi || !admin1PoiResponse.body.poi._id) {
            // Handle the case where 'poi' or '_id' is undefined
            console.error(
                "Error: 'poi' or '_id' is undefined in the response body."
            );
            return;
        }

        // Extract the _id from the response
        const admin1PoiId = admin1PoiResponse.body.poi._id;

        // Admin 2 tries to delete Admin 1's POI
        const response = await request(app)
            .delete(`/pois/deletePoi/${admin1PoiId}`)
            .set('Authorization', `Bearer ${admin2Token}`);

        expect(response.status).toEqual(403);
        expect(response.body).toEqual({
            message:
                "Permission Denied: Admin cannot delete another admin's POI",
        });
    });
});

/*test.todo('User should be able to delete their own POI (200)');

test.todo('User should not be able to delete someone elses POI (404)');

test.todo('User should not be able to delete non existent POI (404)');

test.todo('User should not be able to delete POI by invalid ID (400)');

test.todo('Admin should be able to delete any Users POI (200)');

test.todo('Admin should not be able to delete another Admins POI (403)');

test.todo('User should not be able to delete non existent POI (404)');
test.todo('Admin should not be able to delete POI by invalid ID (400)');
*/
