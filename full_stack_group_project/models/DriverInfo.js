const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator');

const DriverInfoSchema = new Schema({
    username: { type: String, required: [true, 'Please provide username'], unique: true },
    password: { type: String, required: [true, 'Please provide password'] },
    userType: { type: String, default: 'Driver' },
    firstname: { type: String, default: "default" },
    lastname: { type: String, default: "default" },
    LicenseNo: { type: String, default: "default" },
    age: { type: Number, default: 0 },
    AppointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    car_details: {
        make: { type: String, default: "default" },
        model: { type: String, default: "default" },
        year: { type: String, default: "0" },
        platno: { type: String, default: "default" }
    }
});

DriverInfoSchema.plugin(uniqueValidator)

DriverInfoSchema.pre('save', function(next){
    const userInfo = this
    bcrypt.hash(userInfo.password, 10, (error,hash) => {
        userInfo.password = hash
        next()
    })
})
//DriveTest
const DriverInfo = mongoose.model('DriveTest', DriverInfoSchema);

module.exports = DriverInfo;