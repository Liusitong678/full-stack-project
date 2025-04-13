// module.exports = (req, res) => {
//     var date = '';
//     var time = '';
//     const data = req.flash('data')[0];

//     if (typeof data != "undefined") {
//         date = data.date;
//         time = data.time;
//         console.log('admin request param: ', { date, time });
//     }

//     res.render('Appointment', {
//         errors: req.flash('validationErrors'),
//         date: date,
//         time: time,
//     });
// };

const DriverInfo = require('../models/DriverInfo');

// Existing Appointment page route
module.exports = async (req, res) => {
    var date = '';
    var time = '';
    const data = req.flash('data')[0];

    if (typeof data != "undefined") {
        date = data.date;
        time = data.time;
        console.log('admin request param: ', { date, time });
    }

    // ✅ Fetch Pass/Fail candidates
    let candidates = [];
    try {
        candidates = await DriverInfo.find({
            testComment: { $ne: 'default' } // only show if examiner has commented
        });
    } catch (err) {
        console.error("Error fetching pass/fail candidates", err);
    }

    res.render('Appointment', {
        errors: req.flash('validationErrors'),
        date: date,
        time: time,
        candidates: candidates
    });
};
