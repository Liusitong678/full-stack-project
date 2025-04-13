const DriverInfo = require('../models/DriverInfo');

module.exports = async (req, res) => {
    try {
        const driverID = req.params.driverId; 
        const { testComment, testPassed } = req.body; 

        console.log("Driver ID:", driverID, testComment, testPassed);
    
        const passed = testPassed === 'true' ? true : false; 
        console.log("Passed:", passed);

        const drivers = await DriverInfo.findByIdAndUpdate(driverID, { testComment, testPassed: passed });

        console.log("Found drivers:", drivers); // 看有没有结果

        res.redirect('/')
    } catch (error) {
        console.error("Error loading examiner data:", error);
        res.render('ExaminerPage', {
            drivers: [],
            selectedType: null
        });
    }
};