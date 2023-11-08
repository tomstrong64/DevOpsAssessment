import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { boolean } from 'webidl-conversions';

const userSchema = new Schema(
    {
        name: { type: String },
        email: {type: String, required: [true, 'email is required'], unique: true,},
        password: { type: String, required: [true, 'password is required'] },
        admin: {type:  Boolean, default : false},
        token: { type: String },
    },
    { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
