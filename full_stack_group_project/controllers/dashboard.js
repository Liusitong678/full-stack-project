const DriverInfo = require('../models/DriverInfo'); // Correct path to your model

module.exports = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userType = req.session.userType; // Get userType from session

        if (!userId) {
            return res.redirect('/auth/login');
        }

        let driver = null;

        if (userType === 'Driver') {
            driver = await DriverInfo.findById(userId);
        }
        res.render('Dashboard', {
            driver,
            userType: req.session.userType  // Make sure this is set
        });

    } catch (error) {
        console.error("Error loading dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};
