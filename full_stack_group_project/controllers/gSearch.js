const DriveTest = require('../models/DriverInfo')

module.exports = async (req, res) => {
    try {
        // find license number for request
        const LicenseNo = req.body.licenseNo;
        // find user information by using licenseNo
        const userInfo = await DriveTest.findOne({ LicenseNo: LicenseNo, _id: req.session.userId });
        if (!userInfo) {
            req.session.licenseNo = userInfo.LicenseNo;
            req.session.userInfo = userInfo;
            return res.render('GPage', { message: "No User Found", userInfo: null });
        }
        // res.render('GPage', { message: null, userInfo });
    } catch (error) {
        console.log(error);
    }
    res.redirect('/');
}