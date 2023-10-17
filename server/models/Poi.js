import mongoose, { Schema } from 'mongoose';

const poiSchema = new Schema(
    {
        Name: { type: String, required: [true, 'Name is required'] },
        Type: { type: String },
        Country: { type: String },
        Region: { type: String },
        lat: { type: Number },
        lon: { type: Number },
        Description: { type: String },
    },
    { timestamps: true }
);

export const POI = mongoose.model('Poi', poiSchema);
