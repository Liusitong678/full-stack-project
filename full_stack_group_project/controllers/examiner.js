const DriverInfo = require('../models/DriverInfo');

module.exports = async (req, res) => {
    try {
        res.render('examiner', {                                                                                                                        
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
