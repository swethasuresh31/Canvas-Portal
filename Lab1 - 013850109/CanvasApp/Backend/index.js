//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
var connection = require('./db/connection')
const bcrypt = require('bcrypt');
var async = require('async');
var mkdirp = require('mkdirp');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));


app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Route to login
var loginRouter = require('./routes/Login');
app.use('/login', loginRouter);


//Route to get enrolled/created course information when a user visits the course Page
var userCourseRouter = require('./routes/UserCourse');
app.use('/usercourse', userCourseRouter);

//Route to get permission code
var userCourseRouter = require('./routes/Permission');
app.use('/permission', userCourseRouter);

//Route to get announcements
var announcementRouter = require('./routes/Announcement');
app.use('/announcement', announcementRouter);

//Route to get people
var peopleRouter = require('./routes/People');
app.use('/user', peopleRouter);

//Route to get quizzes
var quizRouter = require('./routes/Quiz');
app.use('/quiz', quizRouter);

var assignmentRouter = require('./routes/Assignment');
app.use('/assignment', assignmentRouter);

//Route to get grades
var gradesRouter = require('./routes/Grades');
app.use('/grades', gradesRouter);

//Route to get student assignments
var studentAssignmentRouter = require('./routes/StudentAssignment');
app.use('/studentassignment', studentAssignmentRouter);

//Route to get student assignments
var filesRouter = require('./routes/Files');
app.use('/files', filesRouter);

//Route to get account
var accountRouter = require('./routes/Account');
app.use('/account', accountRouter);

app.post('/signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var role = req.body.role === 'student';
    console.log("Inside Signup Post Request");
    console.log("Req Body : ", req.body);
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw err;
        password = hash;
        connection.query('INSERT INTO user (email_id, name , password, is_student) VALUES (?,?,?,?);', [username, name, password, role], function (error, results, fields) {
            console.log();
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Success");
            }
        });
    });

});


//Route to get course term and department information before student searches for courses
app.get('/searchcourse', function (req, res) {
    console.log("Inside course initial details get handler");
    async.parallel([
        function (callback) {
            connection.query('select course_term from course group by course_term;', function (error, result1) {
                callback(error, result1)
            });
        },
        function (callback) {
            connection.query('select course_dept_code from course group by course_dept_code;', function (error, result2) {
                callback(error, result2)
            });
        }

    ], function (err, results) {
        if (err) {
            res.json({ "status": "failed", "message": error.message })
        } else {
            res.send(JSON.stringify(results));
        }
    });
});

//Route to get all course information when a student searches for courses
app.get('/course', function (req, res) {
    console.log("Inside course search handler");
    let queryString = '';
    console.log("course_term: " + req.query.term);
    console.log("course_dept_code: " + req.query.department);
    console.log("course_id: " + req.query.courseId);
    console.log("course_id_operator: " + req.query.operator);
    console.log("course_name: " + req.query.name);
    if (req.query.term !== '') {
        queryString += ' course_term= \'' + req.query.term + '\' AND';
    }
    if (req.query.department !== '') {
        queryString += ' course_dept_code= \'' + req.query.department + '\' AND';
    }
    if (req.query.name !== '') {
        queryString += ' course_name= \'' + req.query.name + '\' AND';
    }
    if (req.query.operator !== '' && req.query.courseId !== '') {
        queryString += ' course_id';
        if (req.query.operator === 'EQ') {
            queryString += ' = ' + req.query.courseId + ' AND';
        } else if (req.query.operator === 'CON') {
            queryString += ' LIKE \'%' + req.query.courseId + '%\' AND';
        } else if (req.query.operator === 'LTE') {
            queryString += ' <= ' + req.query.courseId + ' AND';
        } else if (req.query.operator === 'GTE') {
            queryString += ' >=' + req.query.courseId + ' AND';
        }
    }
    if (queryString !== '') {
        if (queryString.slice(-4) === ' AND') {
            queryString = queryString.slice(0, -4);
            queryString = ' WHERE' + queryString + ';';
        }
    }
    console.log(queryString);
    connection.query('select * from course' + queryString, function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
        } else {
            console.log(JSON.stringify(results));
            res.send(JSON.stringify(results));
        }
    });
})

//Route to get all course information with a uid
app.get('/course/:uid', function (req, res) {
    console.log("Inside course search handler");
    connection.query('select * from course where course_uid=?', [req.params.uid], function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
        } else {
            console.log(JSON.stringify(results));
            res.send(JSON.stringify(results));
        }
    });
})

app.post('/course', function (req, res) {
    console.log("Inside create course handler");
    var loggedInuser = req.body.user;
    let course_id = req.body.courseId;
    let course_term = req.body.courseTerm;
    let course_name = req.body.courseName;
    let course_deptcode = req.body.courseDeptCode;
    let course_dept = req.body.courseDept;
    let course_desc = req.body.courseDesc;
    let course_instructor = req.body.courseInstructor;
    let course_room = req.body.courseRoom;
    let course_capacity = req.body.courseCapacity;
    let waitlist_capacity = req.body.waitlistCapacity;

    console.log(loggedInuser);
    connection.query('INSERT INTO course(course_id,course_term,course_name,course_dept,course_dept_code, ' +
        'course_desc,course_room,course_capacity,waitlist_capacity,course_instructor,created_by) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?);', [course_id, course_term, course_name, course_deptcode, course_dept, course_desc, course_room, course_capacity, waitlist_capacity, course_instructor, loggedInuser], function (error, results, fields) {
            console.log(course_id);
            if (error) {
                res.status(500).send(error);
            } else {
                createfolder()

            }
        });
});

createfolder = (courseId, courseTerm, res) => {
    connection.query('select * from course where course_id=? and courseTerm=?', [courseId, courseTerm], function (error, results, fields) {
        if (error || results.length !== 1) {
            res.status(500).send(error);
        } else {
            mkdirp('/public/files/courses')
            mkdirp('/public/files/assignments')
            res.status(200).send("Success");
        }
    });
}



//start your server on port 3001
module.exports = app.listen(3001);
console.log("Server Listening on port 3001");

