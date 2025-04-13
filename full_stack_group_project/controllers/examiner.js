// const DriverInfo = require('../models/DriverInfo');

// module.exports = async (req, res) => {
//     try {
//         const selectedType = req.query.type || 'G2'; // 默认显示 G2
//         const query = { TestType: selectedType };

//         const drivers = await DriverInfo.find(query)
//             .populate('GAppointmentId')
//             .populate('G2AppointmentId');

//         res.render('ExaminerPage', {
//             drivers,
//             selectedType
//         });
//     } catch (error) {
//         console.error("Error loading examiner data:", error);
//         res.render('ExaminerPage', {
//             drivers: [],
//             selectedType: null
//         });
//     }
// };
const DriverInfo = require('../models/DriverInfo');

module.exports = async (req, res) => {
    try {
        const selectedType = req.query.type || 'G2';
        console.log("Selected Type:", selectedType); // 打印一下你选的 G or G2

        const drivers = await DriverInfo.find({ TestType: selectedType })
            .populate('GAppointmentId')
            .populate('G2AppointmentId');

        console.log("Found drivers:", drivers); // 看有没有结果

        res.render('ExaminerPage', {
            drivers,
            selectedType
        });
    } catch (error) {
        console.error("Error loading examiner data:", error);
        res.render('ExaminerPage', {
            drivers: [],
            selectedType: null
        });
    }
};
