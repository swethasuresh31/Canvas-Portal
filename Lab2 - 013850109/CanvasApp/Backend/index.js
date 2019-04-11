var express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');

var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');

//Passport authentication
var passport = require('passport');

//set up cors
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.use(cors({ origin: 'http://ec2-18-223-153-77.us-east-2.compute.amazonaws.com:3000', credentials: true }));

//set up session variable

app.use(session({
    secret: 'cmpe273-homeaway-app',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 100,
    activeDuration: 5 * 60 * 100
}));

app.use(bodyParser.json());

//Allow acceess control headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');    
    // res.setHeader('Access-Control-Allow-Origin', 'http://ec2-18-223-153-77.us-east-2.compute.amazonaws.com:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//require('./app/routes')(app);
app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./config/passport')(passport);



//Storing documents/Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    }
    , filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

//Routing


var login = require('./routes/login.js');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
//Route to get account
var accountRouter = require('./routes/Account');
var imgRouter = require('./routes/Img');
var courseRouter = require('./routes/Course');
var userCourseRouter = require('./routes/UserCourse');
var permissionRouter = require('./routes/Permission');
var courseMetadataRouter = require('./routes/CourseMetadata');
var announcementRouter = require('./routes/Announcement');
var quizRouter = require('./routes/Quiz');
var filesRouter = require('./routes/Files');
var assignmentsRouter = require('./routes/Assignments');
var GradesRouter = require('./routes/Grades');
//Route to get permission code

//Route to get enrolled/created course information when a user visits the course Page
// var updateProfile = require('./routes/update-profile');
// var addProperty = require('./routes/add-property');
// var search = require('./routes/search');
// var propertyDetails = require('./routes/property-details');
// var submitBooking = require('./routes/submit-booking');
// var sendMessage = require('./routes/send-message');
// var getMessages = require('./routes/get-messages');
// var getTravelerMessages = require('./routes/get-traveler-messages');
// var tripDetails = require('./routes/trip-details');
// var ownerDashboard = require('./routes/owner-dashboard-details');

//Route config

app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);

//Route for profile account page
app.use('/account', accountRouter);
app.use('/img', imgRouter);
app.use('/course', courseRouter);
app.use('/usercourse', userCourseRouter);
app.use('/permission', permissionRouter);
app.use('/coursemetadata', courseMetadataRouter);
app.use('/announcement', announcementRouter);
app.use('/quiz', quizRouter);
app.use('/files', filesRouter);
app.use('/assignment', assignmentsRouter);
app.use('/grades', GradesRouter);


//Route to get enrolled/created course information when a user visits the course Page
// app.use('/update-profile', updateProfile);
// app.use('/add-property', addProperty);
// app.use('/search', search);
// app.use('/property-details', propertyDetails);
// app.use('/submit-booking', submitBooking);
// app.use('/send-message', sendMessage);
// app.use('/get-messages', getMessages);
// app.use('/get-traveler-messages', getTravelerMessages);
// app.use('/trip-details', tripDetails);
// app.use('/owner-dashboard-details', ownerDashboard);


//upload-file 
app.post('/upload-file', upload.array('photos', 5), (req, res) => {
    console.log('req.body', req.body);
    res.end();
});

//download-file
app.post('/download-file/:file(*)', function(req, res){
    console.log('Inside DOwnload File');
    var file = req.params.file;
    var filelocation = path.join(__dirname + '/uploads', file);
    var img = fs.readFileSync(filelocation);
    var base64img = new Buffer(img).toString('base64');
    res.writeHead(200, {
        'Content--type': 'image/jpg'
    });
    res.end(base64img);
});




module.exports = app;
app.listen(3001);