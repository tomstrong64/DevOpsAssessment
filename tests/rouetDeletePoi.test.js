import app from '../app.js';
import request from 'supertest';

describe('DELETE /pois/deletePoi/:id',() =>{
    it('Should delete the poi with given id',async () => {
        const poiId = "654680535723a0c7ee4bb1aa"
        const response = await request(app).delete(`/pois/deletePoi/${poiId}`);
        expect(response.status)===(200);
        expect(response.body).toEqual({ deleted: true });
    });
    it('Should return 404 if the ID does not exist', async () => {
        const invalidPoiId = "invalid_id";
        const response = await request(app).delete(`/pois/deletePoi/${invalidPoiId}`);
        expect(response.status)===(404);
    });
    
});
