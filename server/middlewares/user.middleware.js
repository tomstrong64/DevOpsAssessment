import User from ('../models/user');


export const authMiddleware = async (req, res, next) => {
    const user = await User.findById(req.session.userID);
    if (!user) {
      return res.redirect('/');
    }
    next()
  };