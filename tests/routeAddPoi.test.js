import app from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';

let poi_region;
let poi_id;

beforeAll(() => {
    mongoose.connect('mongodb://admin:admin@localhost:27017/admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(() => {
    mongoose.disconnect();
});

describe('POST /pois/addPoi', () => {
    it('should add new POI', async () => {
        const response = await request(app)
            .post('/pois/addPoi')
            .send({
                name: 'Swindon',
                type: 'Test Type',
                country: 'London',
                region: 'Solent',
                lat: 50.9105,
                lon: -1.4049,
                description: 'Test Description',
            })
            .set('Content-Type', 'application/json')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTk1OTk1NCwiZXhwIjoxNzAwMDQ2MzU0fQ.jfzCKYEK9n3-i4jvb7a_ODPazXT-dusLPanxnF6xEpk'
            );
        poi_id = response.body._id;
        poi_region = response.body.region;

        expect(response.status).toEqual(201);
    });
});

describe('GET /pois/list?search=poi_region', () => {
    it('should return POIs by region name', async () => {
        const response = await request(app)
            .get(`/pois/list?search=${poi_region}`)
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTk1OTk1NCwiZXhwIjoxNzAwMDQ2MzU0fQ.jfzCKYEK9n3-i4jvb7a_ODPazXT-dusLPanxnF6xEpk'
            );

        expect(response.status).toEqual(200);
    });
});

it('should return all POIs when no query parameters are provided', async () => {
    const response = await request(app)
        .get('/pois/list')
        .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTk1OTk1NCwiZXhwIjoxNzAwMDQ2MzU0fQ.jfzCKYEK9n3-i4jvb7a_ODPazXT-dusLPanxnF6xEpk'
        );

    expect(response.status).toEqual(200);
    expect(typeof response.body).toBe('object');
});

describe('GET /poi/id ', () => {
    it('should return a single POI by ID', async () => {
        const response = await request(app)
            .get(`/pois/${poi_id}`)
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTk1OTk1NCwiZXhwIjoxNzAwMDQ2MzU0fQ.jfzCKYEK9n3-i4jvb7a_ODPazXT-dusLPanxnF6xEpk'
            );

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
