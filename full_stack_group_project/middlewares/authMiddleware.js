//driverAith
module.exports = async (req, res, next) => {
  if(req.session.userId && req.session.userType === 'Driver') {
    return next(); 
  } else {
    return res.redirect('/auth/login'); 
  }
}
