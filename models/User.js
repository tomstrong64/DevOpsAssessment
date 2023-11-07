import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        name: { type: String },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
        },
        password: { type: String, required: [true, 'password is required'] },
        token: { type: String },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    console.log(this.password);
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('could not hash password');
    }
});

export const User = mongoose.model('User', userSchema);
