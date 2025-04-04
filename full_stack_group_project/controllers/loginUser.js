const DriverInfo = require('../models/DriverInfo')
const Appointment = require('../models/Appointment')
const bcrypt = require('bcrypt') // ensure bcrypt is required if not already

module.exports =  async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await DriverInfo.findOne({ username: username })

        if (user) {
            console.log("user-------", user)
            console.log("AppointmentId----", user.AppointmentId);
            
            // 默认 appointmentInfo 为空
            let appointmentInfo = { _id: null, date: null, time: null };

            // 如果用户已有 AppointmentId，则查询对应预约记录
            if (user.AppointmentId) {
                const existAppointment = await Appointment.findById(user.AppointmentId);
                if (existAppointment) {
                appointmentInfo = existAppointment;
                }
            }
            
            bcrypt.compare(password, user.password, (err, same) => {
                if (err) {
                    console.log(err)
                    return res.redirect('/auth/login')
                }


                if (same) {
                    console.log('login pass accepted');
                    req.session.userId = user._id
                    req.session.userType = user.userType
                    req.session.licenseNo = user.LicenseNo;
                    req.session.appointment = appointmentInfo;
                    req.session.userInfo = user;
                    req.session.save(() => {
                        res.redirect('/');
                    });
                    // res.redirect('/')
                } else {
                    req.flash("validationErrors", ["Invalid password! Try again please!"]);
                    req.flash('data', req.body); // Preserve input data
                    res.redirect('/auth/login')
                }
            })
        } else {
            req.flash("validationErrors", ["User not found! Please sign up."]);
            req.flash('data', req.body); // Preserve input data
            res.redirect('/auth/login')
        }

    } catch (error) {
        console.log(error)
        let validationErrors = [];
        if (error.errors) {
            validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        } else {
            validationErrors.push("An error occurred during registration.");
        }

        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body); // Preserve input data
        res.redirect('/auth/login') 
    }
}
