import {} from 'dotenv/config';
import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { POI } from '../models/Poi.js';

let auth_token;
let poi_region;
let poi_id;

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
                country: 'London',
                region: 'Solent',
                lat: 50.9105,
                lon: -1.4049,
                description: 'Test Description',
            });
        poi_id = response.body._id;
        poi_region = response.body.region;

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

/*describe('DELETE /pois/deletePoi/:id',() =>{
  it('Should delete the poi with given id',async () => {
     
      const response = await request(app).delete(`/pois/deletePoi/${poiId}`);
      expect(response.status)===(200);
      expect(response.body)===({ deleted: true });
  });
  it('Should return 404 if the ID does not exist', async () => {
      const invalidPoiId = "invalid_id";
      const response = await request(app).delete(`/pois/deletePoi/${invalidPoiId}`);
      expect(response.status)===(404);
  });
  
});
*/
