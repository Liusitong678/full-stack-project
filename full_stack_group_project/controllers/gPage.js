const DriverInfo = require('../models/DriverInfo');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
    try {
        const user = await DriverInfo.findById(req.session.userId).populate("G2AppointmentId");

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect('/auth/login');
        }

        // const selectedAppointment = await Appointment.findById(user.AppointmentId); // ✅ 读取当前用户已预约的时间
        const selectedAppointment = await Appointment.findById(user.GAppointmentId); // ✅ 读取当前用户已预约的时间
        console.log("Selected Appointment Data:", selectedAppointment);

        const appointments = await Appointment.find({
            isTimeSlotAvailable: true,
            TestType: 'G2' // ✅ 只查 G 的预约时间
          });

     // Retrieve the test result and examiner's comment from the selected appointment
// controller
const testResult = selectedAppointment ? selectedAppointment.testResult : null;
const examinerComment = selectedAppointment ? selectedAppointment.examinerComment : null;

console.log(testResult, examinerComment); // Debugging output


        // if (!user) {
        //     req.flash("error", "User not found.");
        //     return res.redirect('/auth/login');
        // }

        // Determine whether the user has already filled in the LicenseNo
        const isNewUser = user.LicenseNo === 'default';

        res.render('GPage', { 
            userInfo: user, isNewUser,
            // appointmentInfo: req.session.appointment,
            appointmentInfo: selectedAppointment || null, // ✅ 用于页面显示用户已预约信息
            appointments, // ✅ 所有可选时间按钮（数组）
            testResult, // PASS/FAIL status
            examinerComment, // Examiner's comment
            messages: {
                success: req.flash('success') || null,
                error: req.flash('error') || null
            } 
        });
    }  catch (error) {
        console.error("Error loading G page:", error);
        req.flash('error', 'An error occurred while loading the G page.');
        res.redirect('/');
    }
};


