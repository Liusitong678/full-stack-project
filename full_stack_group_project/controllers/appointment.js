const Appointment = require('../models/Appointment');
const DriverInfo = require('../models/DriverInfo');

module.exports = async (req, res) => {
    const { date } = req.query;
    console.log("/appointment: " + date);
    try {
        const appointments = await Appointment.find({ date: date, isTimeSlotAvailable: true });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments.');
    }
};

