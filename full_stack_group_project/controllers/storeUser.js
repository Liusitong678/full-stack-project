const DriverInfo = require('../models/DriverInfo');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const newUser = new DriverInfo(req.body)

        // Ensure password matches rePassword
        if (req.body.rePassword !== newUser.password) {
            req.flash("validationErrors", ["Passwords do not match!"]);
            req.flash('data', req.body); // Preserve input data
            return res.redirect('/auth/signUp');
        }

        // Ensure username is unique
        const { username } = req.body
        const existingUser = await DriverInfo.findOne({ username });
        if (existingUser) {
            req.flash("validationErrors", ["Username already exists!"]);
            req.flash('data', req.body); // Preserve input data
            return res.redirect('/auth/signUp');
        }
        
        await DriverInfo.create(newUser)
        res.redirect('/auth/login'); // Registration success -> Go to login page

    } catch (error) {
        console.log(error);

        // Ensure error.errors exists before mapping
        let validationErrors = [];
        if (error.errors) {
            validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        } else {
            validationErrors.push("An error occurred during registration.");
        }

        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body); // Preserve input data
        return res.redirect('/auth/signUp');
    }
};
