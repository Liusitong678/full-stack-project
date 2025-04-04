const DriverInfo = require('../models/DriverInfo');

module.exports = async (req, res) => {
    try {
        const user = await DriverInfo.findById(req.session.userId);
        console.log("user",user);
        console.log("req.session.appointment",req.session.appointment);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect('/auth/login');
        }

        res.render('G2Page', { 
            userInfo: user,                                                                                                                           
            appointmentInfo: req.session.appointment,
            messages: {
                success: req.flash('success') || '',
                error: req.flash('error') || ''
            } 
        });
    } catch (error) {
        console.error("Error loading G2 page:", error);
        res.redirect('/');
    }
};
