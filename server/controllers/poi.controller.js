import { POI } from '../models/Poi.js';

export const getPois = async (req, res) => {
    try {
        const pois = await POI.find({});
        res.json(pois);
    } catch (error) {
        res.status(404).send({ message: "could not find any POI's" });
    }
};

export const getPoiByRegion = async (req, res) => {
    const region = req.params.region;

    try {
        const poi = await POI.find({ region: region });

        if (!poi) {
            return res.status(404).json({ message: "POI not found" });
        }

        res.json(poi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePoi = async (req, res) => {
    const id = req.params.id;

    try {
        await POI.findByIdAndRemove(id);
        res.json({deleted: true});
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
        return res.status(400).send({message: JSON.parse(e),});
    }
};

export const updatePoi = async (req, res) => {
    const id = req.params.id;
    try {
        const poi = await POI.updateOne({ _id: id }, req.body);
        res.json({updated: true})
    } catch (e) {
        res.status(500);
    }
};
