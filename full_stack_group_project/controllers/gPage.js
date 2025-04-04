const DriverInfo = require('../models/DriverInfo');

module.exports = async (req, res) => {
    try {
        const user = await DriverInfo.findById(req.session.userId);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect('/auth/login');
        }

        // Determine whether the user has already filled in the LicenseNo
        const isNewUser = user.LicenseNo === 'default';

        res.render('GPage', { 
            userInfo: user, isNewUser,
            messages: {
                success: req.flash('success') || null,
                error: req.flash('error') || null
            } 
        });
    } catch (error) {
        console.error("Error loading G page:", error);
        res.redirect('/');
    }
};
