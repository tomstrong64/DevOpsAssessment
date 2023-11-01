import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const getUser = async (req, res) => {
    try {
        let user;
        const userId = req.query.id;

        if (userId) {
            user = await User.findById(userId);
        } 
        else {
            user = await User.find({});
        }
        if (!user) {
            return res.status(500).json({ message: "No Users found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.render('login-user', {
                errors: { email: { message: 'email not found' } },
            });
            return;
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/');
            return;
        }

        res.render('login-user', {
            errors: { password: { message: 'password does not match' } },
        });
    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};

export const create = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the password field is not blank
        if (!password) {
            return res.status(400).json({ message: 'Password cannot be blank' });
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


export const logout = async (req, res) => {
    try {
        req.session.destroy();
        global.user = false;
        res.redirect('/');
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('/logout', { errors: e.errors });
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};
export const updateUser = async (req, res) => {
    const id = req.query.id;
    const { username, email, password, currentPassword } = req.body;

    try {
        // Check if the password field is not blank
        if (!password) {
            return res.status(400).json({ message: 'Password cannot be blank' });
        }

        // Find the user by ID
        const user = await User.findById(id);

        // Check if the current password matches
        if (user.password !== currentPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // If current password is correct, update the user's details
        const updatedUser = await User.updateOne({ _id: id }, { username, email, password });
        res.json({ updated: true });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const profile = async (req, res) => {
    res.render('updateuser')
}
