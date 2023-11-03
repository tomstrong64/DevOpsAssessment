import mongoose, { Schema } from 'mongoose';

const poiSchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is required'] },
        type: { type: String },
        country: { type: String },
        region: { type: String },
        lat: { type: Number },
        lon: { type: Number },
        description: { type: String },
    },
    { timestamps: true }
);

const POI = mongoose.model('Poi', poiSchema);
export default POI;
