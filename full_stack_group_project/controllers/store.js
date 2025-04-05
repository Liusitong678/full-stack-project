const DriverInfo = require('../models/DriverInfo');
const Appointment = require('../models/Appointment')

module.exports = async (req, res) => {
    try {
        if (!req.session.userId) {
            req.flash("error", "You must be logged in to submit information.");
            return res.redirect('/auth/login');
        }
        console.log(req.body);
        
        const { firstname, lastname, LicenseNo, age, make, model, year, platno, AppointmentId, TestType } = req.body;


        const existingUser = await DriverInfo.findById(req.session.userId);

        // if (existingUser) {
        //     // User already exists ->Update data
        //     await DriverInfo.findByIdAndUpdate(req.session.userId, {
        //         $set: {
        //             firstname,
        //             lastname,
        //             LicenseNo,
        //             age,
        //             AppointmentId,
        //             TestType, //G or G2 page
        //             'car_details.make': make,
        //             'car_details.model': model,
        //             'car_details.year': year,
        //             'car_details.platno': platno
        //         }
        //     });

        //     req.flash("success", "Your information has been updated.");
        // } else {
        //     // User does not exist ->Create new data
        //     console.log("appointment",req.session);
            
        //     await DriverInfo.create({
        //         _id: req.session.userId, // ID
        //         // AppointmentId: req.session.AppointmentID,
        //         firstname,
        //         lastname,
        //         LicenseNo,
        //         age,
        //         TestType, //G or G2 page
        //         car_details: {
        //             make,
        //             model,
        //             year,
        //             platno
        //         }
        //     });

        //     req.flash("success", "Your information has been saved.");
        // }
        
        // if(AppointmentId) {
        //     // const newAppointment = await Appointment.findById(AppointmentId);
        //     const updatedAppointment = await Appointment.findByIdAndUpdate(
        //         AppointmentId,
        //         { isTimeSlotAvailable: false },
        //         { new: true }
        //     );
        //     req.session.appointment = updatedAppointment;
        // }
        if (existingUser) {
            const updateData = {
              firstname,
              lastname,
              LicenseNo,
              age,
              'car_details.make': make,
              'car_details.model': model,
              'car_details.year': year,
              'car_details.platno': platno
            };
            updateData.TestType = TestType;
          
            if (AppointmentId) {
              if (TestType === 'G') {
                updateData.GAppointmentId = AppointmentId;
              } else {
                updateData.G2AppointmentId = AppointmentId;
              }
          
              await Appointment.findByIdAndUpdate(AppointmentId, {
                isTimeSlotAvailable: false
              }, { new: true });
          
            //   req.session.appointment = await Appointment.findById(AppointmentId);
            }
          
            await DriverInfo.findByIdAndUpdate(req.session.userId, { $set: updateData });
          
          } else {
            // 创建新用户
            const newUserData = {
              _id: req.session.userId,
              firstname,
              lastname,
              LicenseNo,
              age,
              car_details: {
                make,
                model,
                year,
                platno
              }
            };
          
            if (AppointmentId) {
              if (TestType === 'G') {
                newUserData.GAppointmentId = AppointmentId;
              } else {
                newUserData.G2AppointmentId = AppointmentId;
              }
          
              await Appointment.findByIdAndUpdate(AppointmentId, {
                isTimeSlotAvailable: false
              }, { new: true });
          
              req.session.appointment = await Appointment.findById(AppointmentId);
            }
          
            await DriverInfo.create(newUserData);
          }
          
        // 最后导航根据 TestType 来判断
        if (TestType === 'G2') {
            res.redirect('/G2');
        } else {
            res.redirect('/G');
        }
    } catch (error) {
        console.error("Error storing info:", error);
        req.flash("error", "An error occurred while saving your information.");
        
        if (req.originalUrl.includes('/G2')) {
            res.redirect('/G2');
        } else {
            res.redirect('/G');
        }
    }
};

