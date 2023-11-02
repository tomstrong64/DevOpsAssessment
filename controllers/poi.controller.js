import { POI } from '../models/Poi.js';

export const getPois = async (req, res) => {
    try {
        let pois;
        const region = req.query.search;
        const poiId = req.query.id;

        if (poiId) {
            pois = await POI.findById(poiId);
        } else if (region) {
            pois = await POI.find({ region: region });
        } else {
            pois = await POI.find({});
        }

        if (!pois) {
            return res.status(500).json({ message: 'No POIs found' });
        }

        res.json(pois);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePoi = async (req, res) => {
    const id = req.params.id;

    try {
        await POI.findByIdAndRemove(id);
        res.json({ deleted: true });
    } catch (error) {
        res.status(500).send({ message: 'could not delete the POI' });
    }
};

export const addPoi = async (req, res) => {
    try {
        const pois = new POI({
            name: req.body.name,
            type: req.body.type,
            country: req.body.country,
            region: req.body.region,
            lat: req.body.lat,
            lon: req.body.lon,
            description: req.body.description,
        });
        await pois.save();
        res.sendStatus(201);
    } catch (e) {
        return res.status(400).send({ message: e.message });
    }
};

export const updatePoi = async (req, res) => {
    const id = req.query.id;
    try {
        const poi = await POI.updateOne({ _id: id }, req.body);
        res.json({ updated: true });
    } catch (e) {
        res.status(500);
    }
};
