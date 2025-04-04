const Appointment = require('../models/Appointment.js');
const path = require('path');

module.exports = async (req, res) => {
    try {
        console.log("Admin page start.");
        const { date, time } = req.body;

        //checked date & time unique
        const existingAppointment = await Appointment.findOne({ date, time });
        if (existingAppointment) {
            req.flash('validationErrors', [`Time slot already exists for date: ${date}, time: ${time}`]);
            req.flash('data', req.body);
            return res.redirect('/admin');
        }

        const newAppointment = new Appointment(req.body);

        const saveResult = await Appointment.create(newAppointment);

        console.log("Store Appointment. saveResult=" + saveResult);
    } catch (error) {
        console.log('admin error: ', error);
        if (error.code === 11000) {
            const duplicateKey = JSON.stringify(error.keyValue);
            req.flash('validationErrors', [`Duplicate entry detected: ${duplicateKey}`]);
        } else {
            const validationErrors = Object.keys(error.errors || {}).map(
                (key) => error.errors[key]?.message || 'Unknown error'
            );
            req.flash('validationErrors', validationErrors);
        }
        req.flash('data', req.body);
        return res.redirect('/admin');
    }
    res.redirect('/');
};
