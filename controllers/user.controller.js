import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        // check if all fields are provided
        if (!req.body.email || !req.body.password)
            return res
                .status(400)
                .json({ message: 'Email and password required' });

        // check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });

        // check if password matches
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match)
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });

        // generate auth token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // save token to user document
        user.token = token;
        await user.save();

        // return token to client
        return res.status(200).json({
            message: 'Login successful',
            token,
            redirect: '/',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const create = async (req, res) => {
    try {
        // check if all fields are provided
        if (!req.body.name || !req.body.email || !req.body.password)
            return res
                .status(400)
                .json({ message: 'Name, email and password required' });

        // check if user exists
        const existing = await User.findOne({ email: req.body.email });
        if (existing)
            return res.status(401).json({
                message: 'A user with this email already exists',
                redirect: '/user/login',
            });

        // create user
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
        });

        // generate auth token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // save token to user document
        user.token = token;
        await user.save();

        // return token to client
        return res.status(200).json({
            message: 'User created successfully',
            token,
            redirect: '/',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.id);

        // remove token
        user.token = '';
        await user.save();

        // return success message
        return res.status(200).json({
            message: 'Logout successful',
            redirect: '/user/login',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
};
