//adminAuth
module.exports = async (req, res, next) => {
    if (req.session.userId && req.session.userType === 'Admin') {
      return next();
    } else {
      return res.redirect('/auth/login');
    }
  };