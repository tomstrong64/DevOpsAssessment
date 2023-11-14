import POI from '../models/Poi.js';

export const getPois = async (req, res) => {
    try {
        let pois;
        const region = req.query.search;

        // if admin, return all POIs in region
        if (region && res.locals.user.admin) {
            pois = await POI.find({ region: region });
        }
        // if not admin, return all POIs in region owned by user
        else if (region) {
            pois = await POI.find({
                region: region,
                user: res.locals.user._id,
            });
        }
        // if admin, return all POIs
        else if (res.locals.user.admin) {
            pois = await POI.find();
        }
        // if not admin, return all POIs owned by user
        else {
            pois = await POI.find({ user: res.locals.user._id });
        }

        // check if POIs found
        if (!pois) return res.status(500).json({ message: 'No POIs found' });

        return res.json(pois);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPoiById = async (req, res) => {
    try {
        let poi;

        if (res.locals.user.admin) {
            poi = await POI.findById(req.params.id);
        } else {
            poi = await POI.findOne({
                _id: req.params.id,
                user: res.locals.user._id,
            });
        }

        if (!poi) return res.status(404).json({ message: 'POI not found' });

        return res.json(poi);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePoi = async (req, res) => {
    try {
        const id = req.params.id;

        // check if POI exists and is owned by user
        const poi = await POI.findOne({
            _id: id,
            user: res.locals.user._id,
        });
        if (!poi) return res.status(404).json({ message: 'POI not found' });

        // delete POI
        await POI.findByIdAndRemove(id);
        return res.json({ message: 'POI successfully deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const addPoi = async (req, res) => {
    try {
        // check all fields are present
        if (
            !req.body.name ||
            !req.body.type ||
            !req.body.country ||
            !req.body.region ||
            !req.body.lat ||
            !req.body.lon ||
            !req.body.description
        ) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        // create POI
        const poi = new POI({
            name: req.body.name,
            type: req.body.type,
            country: req.body.country,
            region: req.body.region,
            lat: req.body.lat,
            lon: req.body.lon,
            description: req.body.description,
            user: res.locals.user._id,
        });
        await poi.save();

        return res.status(201).json(poi);
    } catch (e) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatePoi = async (req, res) => {
    try {
        const id = req.params.id;

        // check if POI exists and is owned by user
        const poi = await POI.findOne({
            _id: id,
            user: res.locals.user._id,
        });
        if (!poi) return res.status(404).json({ message: 'POI not found' });

        // update POI with provided fields
        if (req.body.name) poi.name = req.body.name;
        if (req.body.type) poi.type = req.body.type;
        if (req.body.country) poi.country = req.body.country;
        if (req.body.region) poi.region = req.body.region;
        if (req.body.lat) poi.lat = req.body.lat;
        if (req.body.lon) poi.lon = req.body.lon;
        if (req.body.description) poi.description = req.body.description;
        await poi.save();

        return res.json({ message: 'POI successfully updated' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export default getPois;