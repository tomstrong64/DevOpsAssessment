import app from '../app.js';
import request from 'supertest';
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
            .set('Content-Type', 'application/json');
        expect(response.headers['Content-Type']).toBeUndefined();
        expect(response.status).toBe(201);
    }, 10000);
});
