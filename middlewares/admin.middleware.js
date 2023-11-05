import { User } from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
    const user = await User.findById(req.session.userID);
        if (user && user.admin == true) {
            next();
        }
        else {
            return res.redirect('/');
        }
};
