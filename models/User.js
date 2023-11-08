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

userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('could not hash password');
    }
});

export const User = mongoose.model('User', userSchema);
