import mongoose from ('mongoose');
import { Schema } from mongoose;

const poiSchema = new Schema(
    {
        Name: { type: String, required: [true, 'Name is required']},
        Type: {type: String,},
        Country: {type: String,},
        Region: {type: String,},
        lat: {type: Double,},
        lon: {type: Double,},
        Description: {type: String,}

    },
    { timestamps: true }
);

module.exports = mongoose.model("Poi", poiSchema);