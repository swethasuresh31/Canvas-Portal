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
// app.use(cors({ origin: 'http://ec2-3-18-88-98.us-east-2.compute.amazonaws.com:3000', credentials: true }));

//set up session variable

app.use(session({
    secret: 'cmpe273-canvas-app',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 100,
    activeDuration: 5 * 60 * 100
}));

app.use(bodyParser.json());

//Allow acceess control headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');    
    // res.setHeader('Access-Control-Allow-Origin', 'http://ec2-3-18-88-98.us-east-2.compute.amazonaws.com:3000');
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

//Routing


var login = require('./routes/login.js');
var signup = require('./routes/signup');
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
var StudentsAssignmentRouter = require('./routes/StudentsAssignment');
var GradesRouter = require('./routes/Grades');
var MessagesRouter = require('./routes/Messages');
//Route to get permission code

//Route config

app.use('/login', login);
app.use('/signup', signup);

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
app.use('/studentassignment', StudentsAssignmentRouter);
app.use('/grades', GradesRouter);
app.use('/message', MessagesRouter);

module.exports = app;
app.listen(3001);