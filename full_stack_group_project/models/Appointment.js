// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userType: { type: String, default: 'Driver' },
  date: { type: String, required: true }, // format is as follows "YYYY-MM-DD"
  time: { type: String, required: true }, // "9:00" 
  isTimeSlotAvailable: { type: Boolean, default: true },
  TestType: { type: String, enum: ['G', 'G2'] },
  testResult: { type: String, enum: ['PASS', 'FAIL'], default: null }, // This field holds the test result
  examinerComment: { type: String, default: null }
});

AppointmentSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);

