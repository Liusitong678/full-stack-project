//packages
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser');

//Controller files
const dashboardController = require('./controllers/dashboard.js')
const gPageController = require('./controllers/gPage.js')
const gSearchController = require('./controllers/gSearch.js')
const g2PageController = require('./controllers/g2Page.js')
const storeController = require('./controllers/store.js')
//sign up and login 
const newUserController = require('./controllers/newUser.js')
const storeUserController = require('./controllers/storeUser.js')
const loginController = require('./controllers/login.js')
const loginUserController = require('./controllers/loginUser.js')
//logout
const logoutController = require('./controllers/logout.js')
// new controller
const appointmentController = require('./controllers/appointment');
const adminController = require('./controllers/admin');
const adminStoreController = require('./controllers/adminStore');

//Custom Middlewares
const validateMiddleware = require('./middlewares/validateMiddleware')
const authMiddleware = require('./middlewares/authMiddleware.js')
const adminMiddleware = require('./middlewares/adminMiddleware.js');

//initializing express app
const app = new express()

//view templating engine
app.set('view engine', 'ejs')

//setting folder for static files
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(flash())

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(expressSession({
    secret: 'drive test',
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
})) 

global.loggedIn = null
global.isDriver = null
global.isAdmin = null

app.use("*", (req,res,next) => {
    loggedIn = req.session.userId;
    isDriver = req.session.userType == 'Driver';
    isAdmin = req.session.userType == "Admin";
    next()
})

//conntction to MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.cbslt.mongodb.net/drive_test?retryWrites=true&w=majority&appName=Cluster0')

//request handlers(get, post, put)
app.get('/', dashboardController)

app.get('/G',authMiddleware, gPageController)
//search data from mongoDB
app.post('/G/search', gSearchController)

app.get('/G2', authMiddleware, g2PageController)

//signUp routes
app.get('/auth/signUp', validateMiddleware, newUserController)
app.post('/users/signUp', validateMiddleware, storeUserController)

//login routes
app.get('/auth/login', validateMiddleware, loginController)
app.post('/users/login', validateMiddleware, loginUserController)

//Logout Route
app.get('/auth/logout', logoutController)

//save data to mongoDB
app.post('/posts/store', storeController)

// ===== new route =====
//admin
app.get('/admin', adminMiddleware, adminController);
app.post('/admin/store', adminMiddleware, adminStoreController);

// Admin - View Appointment Page
app.get('/appointment', appointmentController);

//not found
app.use((req,res) => res.render('notfound'))

//port number
app.listen(4001, () => {
    console.log('App is runnig at 4001 port')
})