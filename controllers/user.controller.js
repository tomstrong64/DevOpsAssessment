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
import { POI } from '../models/Poi.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

export const getUserById = async (req, res) => {
    try {
        let user;
        const userId = res.locals.user._id;

        if (userId) {
            user = await User.findById(userId);
        } else {
            return res.status(500).json({ message: 'No Users found' });
        }
        return res.json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const login = async (req, res) => {
    try {
        // check if all fields are provided
        if (!req.body.email || !req.body.password)
            return res
                .status(400)
                .json({ message: 'Email and password required' });
        const email = req.body.email.toLowerCase();
        // check if user exists
        const user = await User.findOne({ email: email });
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
        // Set the auth token as a cookie
        res.cookie('token', token);
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
        const email = req.body.email.toLowerCase();
        // check if user exists
        const existing = await User.findOne({ email: email });
        if (existing)
            return res.status(401).json({
                message: 'A user with this email already exists',
                redirect: '/login',
            });

        // create user
        const user = await User.create({
            name: req.body.name,
            email: email,
            password: await bcrypt.hash(req.body.password, 10),
        });

        // generate auth token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        // Set the auth token as a cookie
        res.cookie('token', token);

        // save token to user document
        user.token = token;
        await user.save();

        // return token to client
        return res.status(201).json({
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
        res.clearCookie('token');
        await user.save();

        // return success message
        return res.status(200).json({
            message: 'Logout successful',
            redirect: '/login',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
};

export const updateUser = async (req, res) => {
    const { name, newpassword, confirmpassword, password, email } = req.body;

    try {
        // Check if the password field is not blank
        if (!password) {
            return res
                .status(400)
                .json({ message: 'Password cannot be blank' });
        }

        let user = res.locals.user;

        // Check if the current password matches
        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res
                .status(401)
                .json({ message: 'Current pasword is Incorrect' });

        // If current password is correct, update the user's details
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (newpassword !== confirmpassword)
            return res.status(400).json({ message: 'Passwords do not match' });
        if (newpassword && newpassword === confirmpassword)
            user.password = await bcrypt.hash(newpassword, 10);
        await user.save();

        return res.status(200).json({
            updated: true,
            message: 'Updated successfully',
            redirect: '/',
        });
    } catch (e) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.json(users);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    const user = res.locals.user;
    const id = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });

        if (user.admin) {
            const founduser = await User.findById(id);
            if (founduser.admin) {
                return res.status(403).send({
                    message: `cannot delete an admin user.`,
                });
            } else {
                await POI.deleteMany({ user: id });
                await User.findByIdAndRemove(id);
                return res.status(200).json({
                    message: 'User Deleted successfully',
                });
            }
        } else {
            await POI.deleteMany({ user: user.id });
            await User.findByIdAndRemove(user.id);
            return res.status(200).json({
                message: 'User Deleted successfully',
                redirect: '/login',
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: `could not delete user ${id}.`,
        });
    }
};
export const updateUserStatus = async (req, res) => {
    const id = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });

        const founduser = await User.findById(id);
        if (founduser.admin) {
            return res.status(403).send({
                message: `cannot update an admin user.`,
            });
        }
        await User.findByIdAndUpdate(id, { admin: true });
        return res.status(200).json({
            message: 'User Updated successfully',
            redirect: '/allusers',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: `could not update user ${id}.`,
        });
    }
};
