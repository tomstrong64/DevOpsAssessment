
import express from 'express'
import {app} from '../app.mjs'

app.use(express.json());

describe("POST /pois/addPoi", () => {
    it("should add new POI", async () => {
        const response = await request(app)
            .post("/pois/addPoi") 
            .send({
                name: "Test POI",
                type: "Test Type",
                country: "Test Country",
                region: "Test Region",
                lat: 123.45,
                lon: 67.89,
                description: "Test Description",
            });

        expect(response.status).toBe(201);

    });
});
