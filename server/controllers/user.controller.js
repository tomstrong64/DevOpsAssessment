const User = require('../models/User');
const bcrypt = require('bcrypt');

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.render('login-user', { errors: { email: { message: 'email not found' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/');
            return
        }

        res.render('login-user', { errors: { password: { message: 'password does not match' } } })


    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

export const create = async (req, res) => {
    try {

        const user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
        await user.save();
        res.redirect('/?message=user saved')
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('create-user', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}
export const logout = async (req, res) => {
    try {
        req.session.destroy();
        global.user = false;
        res.redirect('/');
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('/logut', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
     }
}