import app from '../app.js';
import request from 'supertest';

describe('POST /pois/addPoi', () => {
    it('should add new POI', async () => {
        const response = await request(app).post('/pois/addPoi').send({
            "name" :"Solent",
            "type": "Test Type",
            "country": "London",
            "region": "Solent",
            "lat": 50.9105,
            "lon": -1.4049,
            "description": "Test Description"

        })
        .set('Content-Type','application/json')
        .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGNjNTRjMjI0NTRhY2QyNTEyNTZlMyIsImlhdCI6MTY5OTUzNDAyNSwiZXhwIjoxNjk5NjIwNDI1fQ.xI2QyI_vlO3dFiaLw1NHTKBvdmBjWnIQ_ZqocdNZJCM');
        expect(response.headers['Content-Type']).toBeUndefined();
        expect(response.status).toBe(201);
    },);
});

  