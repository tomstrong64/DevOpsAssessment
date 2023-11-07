import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

// middleware to ensure user is not logged in already
export const noAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization)
            return res.send(400).json({ message: 'Already logged in' });
        return next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// middleware to ensure user is logged in
export const stdAuth = async (req, res, next) => {
    try {
        // check if token is provided
        if (!req.headers.authorization)
            return res.status(401).json({ message: 'Unauthorized' });

        // decode token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from db
        const user = await User.findOne({ _id: decoded.id, token: token });

        // check if user exists
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // attach user object to res.locals
        res.locals.user = user;
        return next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// middleware to ensure user is logged in and is admin
export const adminAuth = async (req, res, next) => {
    try {
        // check if token is provided
        if (!req.headers.authorization)
            return res.status(401).json({ message: 'Unauthorized' });

        // decode token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from db
        const user = await User.findOne({
            _id: decoded.id,
            token: token,
            admin: true,
        });

        // check if user was found
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // attach user object to res.locals
        res.locals.user = user;
        return next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
