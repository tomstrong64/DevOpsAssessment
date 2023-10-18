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

export const POI = mongoose.model('Poi', poiSchema);
