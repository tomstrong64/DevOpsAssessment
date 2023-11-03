import request from 'supertest';
import app from '../app.js'; 

describe('GET /pois/getPois', () => {
  
  it('should return POIs by region name', async () => {
 
    const region = 'Test Region';
    const response = await request(app).get(`/pois/getPois?search=${region}`);

    expect(response.status)===(200);
    expect(response.body.region)===('Test Region');
    

  });

  it('should return a single POI by ID', async () => {
    const poiId = '65439bd3a67da98f92f9c6de';
    const response = await request(app).get(`/pois/getPois?id=${poiId}`);

    expect(response.status)===(200);
    expect(response.body._id)===(poiId);
  });

  it('should return all POIs when no query parameters are provided', async () => {
    const response = await request(app).get('/pois/getPois');

    expect(response.status)===(200);
    expect(Array.isArray(response.body))===(true);
    
  });
});
