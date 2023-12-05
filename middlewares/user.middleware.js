/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// middleware to ensure user is not logged in already
export const noAuthAPI = async (req, res, next) => {
    try {
        if (req.headers.authorization)
            return res.status(400).json({ message: 'Already logged in' });
        return next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// middleware to ensure user is logged in
export const stdAuthAPI = async (req, res, next) => {
    try {
        // check if token is provided
        if (!req.headers.authorization)
            return res.status(401).json({ message: 'Unauthorized' });

        // decode token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from db
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(decoded.id),
            token: token,
        });

        // check if user exists
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // attach user object to res.locals
        res.locals.user = user;
        return next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session expired! Please login again.',
                redirect: '/login.ejs',
            });
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Malformed token! Please login again.',
                redirect: '/login.ejs',
            });
        }
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// middleware to ensure user is logged in and is admin
export const adminAuthAPI = async (req, res, next) => {
    try {
        // check if token is provided
        if (!req.headers.authorization && !req.cookies.token)
            return res.status(401).json({ message: 'Unauthorized' });

        // decode token
        const token = req.headers.authorization
            ? req.headers.authorization.split(' ')[1]
            : req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from db
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(decoded.id),
            token: token,
            admin: true,
        });

        // check if user was found
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // attach user object to res.locals
        res.locals.user = user;
        return next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session expired! Please login again.',
                redirect: '/login.ejs',
            });
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Malformed token! Please login again.',
                redirect: '/login.ejs',
            });
        }
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// ensure user is not logged in already and redirect to home page if they are
export const noAuthPage = async (req, res, next) => {
    try {
        if (req.cookies.token) return res.redirect('/');
        return next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// ensure user is logged in otherwise redirect to login page
export const stdAuthPage = async (req, res, next) => {
    const sendToLogin = () => {
        res.clearCookie('token');
        return res.redirect('/login');
    };

    try {
        // check if token is provided
        if (!req.cookies.token) return sendToLogin();

        // decode token
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from db
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(decoded.id),
            token: token,
        });

        // check if user exists
        if (!user) return sendToLogin();

        // attach user object to res.locals
        res.locals.user = user;
        return next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return sendToLogin();
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return sendToLogin();
        }
        console.log(e);
        return sendToLogin();
    }
};

// ensure user is logged in as admin or redirect to home page or login if not logged in
export const adminAuthPage = async (req, res, next) => {
    const sendToLogin = () => {
        res.clearCookie('token');
        return res.redirect('/login');
    };

    try {
        // check if token is provided
        if (!req.cookies.token) return sendToLogin();

        // decode token
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from db
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(decoded.id),
            token: token,
            admin: true,
        });

        // check if user was found
        if (!user) return res.redirect('/');

        // attach user object to res.locals
        res.locals.user = user;
        return next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return sendToLogin();
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return sendToLogin();
        }
        console.log(e);
        return res.redirect('/');
    }
};
