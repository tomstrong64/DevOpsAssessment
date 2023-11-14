import app from '../app.js';
import request from 'supertest';

let poi_region = 'London';
let poi_id;

describe('POST /pois/addPoi', () => {
    it('should add new POI', async () => {
        const response = await request(app)
            .post('/pois/addPoi')
            .send({
                name: 'Swindon',
                type: 'Test Type',
                country: poi_region,
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
        console.log(poi_id);
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

/*it('should return a single POI by ID', async () => {
   
    const response = await request(app).get(`/pois/getPois?id=${poiId}`)
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTYzNTU4MiwiZXhwIjoxNjk5NzIxOTgyfQ.7yv4NlcBbzvI62d2awQjhrkcm6GBSnRENiwrameMSjM');

    expect(response.status).toEqual(200);
    expect(response.body._id).toEqual(poiId);
  });

  it('should return all POIs when no query parameters are provided', async () => {
    const response = await request(app).get('/pois/getPois')
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTYzNTU4MiwiZXhwIjoxNjk5NzIxOTgyfQ.7yv4NlcBbzvI62d2awQjhrkcm6GBSnRENiwrameMSjM');

    expect(response.status).toEqual(500);
    expect(typeof response.body).toBe('object');
  });
});*/
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
