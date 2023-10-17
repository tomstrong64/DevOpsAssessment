import { POI } from '../models/Poi.js';

export const getPois = async (req, res) => {
    try {
        const pois = await POI.find({});
        res.render('/pois');
    } catch (error) {
        res.status(404).send({ message: "could not find any POI's" });
    }
};

export const deletePoi = async (req, res) => {
    const id = req.params.id;

    try {
        await POI.findByIdAndRemove(id);
        res.redirect('/Pois');
    } catch (error) {
        res.status(404).send({ message: 'could not delete the POI' });
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
            lot: req.body.lot,
            description: req.body.description,
        });

        await POI.save();
        res.redirect('/Pois/?message= POI has been added!');
    } catch (e) {
        if ((e, erros)) {
            console.log(e.errors);
            res.render('add-poi', { errors: e.errors });
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};

export const updatePoi = async (req, res) => {
    const id = req.params.id;
    try {
        const poi = await POI.updateOne({ _id: id }, req.body);
        res.redirect('/Pois/?message= POI has been updated!');
    } catch (e) {
        res.status(404).send({
            message: `could not find POI! ${id}`,
        });
    }
};
