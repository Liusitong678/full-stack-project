const DriverInfo = require('../models/DriverInfo');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
    try {
        const user = await DriverInfo.findById(req.session.userId);
        console.log("user",user);
        const appointments = await Appointment.find({
            isTimeSlotAvailable: true,
            TestType: 'G2' // ✅ 只查 G2 的预约时间
          });
        // console.log("req.session.appointment",req.session.appointment);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect('/auth/login');
        }

        const isNewUser = user.LicenseNo === 'default';
        // const selectedAppointment = await Appointment.findById(user.AppointmentId); // ✅ 查出当前用户预约的 G2 时间
        const selectedAppointment = await Appointment.findById(user.G2AppointmentId);


        res.render('G2Page', { 
            userInfo: user,                                                                                                                           
            isNewUser,
            appointmentInfo: selectedAppointment || null, // ✅ 用于显示已预约时间
            appointments, // ✅ 所有可选时间段
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
