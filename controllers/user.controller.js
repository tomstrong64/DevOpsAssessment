import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUserById = async (req, res) => {
    try {
        let user;
        const userId = res.locals.user._id;

        if (userId) {
            user = await User.findById(userId);
        } else {
            return res.status(500).json({ message: 'No Users found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        // save token to user document
        user.token = token;
        await user.save();

        // return token to client
        return res.status(200).json({
            message: 'Login successful',
            token,
            redirect: '/index.html',
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
                redirect: '/user/login',
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

        // save token to user document
        user.token = token;
        await user.save();

        // return token to client
        return res.status(201).json({
            message: 'User created successfully',
            token,
            redirect: '/index.html',
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
            redirect: '/login.html',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Internal server error',
        });
    }
};

export const updateUser = async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { name, newpassword, confirmpassword, password } = req.body;

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
        if (email) user.email = email;
        if (newpassword && newpassword === confirmpassword)
            user.password = await bcrypt.hash(newpassword, 10);
        await user.save();

        return res.status(200).json({
            updated: true,
            message: 'Updated successfully',
            redirect: '/index.html',
        });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const profile = async (req, res) => {
    res.render('updateuser');
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createAdmin = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const { name, password, admin } = req.body;

        // Check if the password field is not blank
        if (!password) {
            return res
                .status(400)
                .json({ message: 'Password cannot be blank' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If email doesn't exist and password is provided, create a new user
        const user = new User({
            name,
            email,
            password,
            admin,
        });
        await user.save();
        return res.status(201).json({ message: 'User Created' });
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('register.html', { errors: e.errors });
            return;
        }
        return res.status(400).json({
            message: JSON.parse(e),
        });
    }
};
export const deleteUser = async (req, res) => {
    const user = res.locals.user;
    const id = req.body.id;
    try {
        if (user.admin) {
            await User.findByIdAndRemove(id);
        }
        await User.findByIdAndRemove(user.id);
        return res.status(200).json({
            message: 'User Deleted successfully',
            redirect: '/login.html',
        });
    } catch (e) {
        console.log(e);
        res.status(404).send({
            message: `could not delete user ${id}.`,
        });
    }
};
