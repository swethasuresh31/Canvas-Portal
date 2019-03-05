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

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
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


//Route to handle Post Request Call
app.post('/login', function (req, response) {
    var username = req.body.username;
    var password = req.body.password;
    console.log("Inside Login Post Request");
    console.log("Req Body : ", req.body);
    connection.query('SELECT password,is_student FROM user WHERE email_id = ?', [username], function (error, results, fields) {
        if (results.length == 0) {
            response.status(404).send("Username does not exists!");
        } else {
            bcrypt.compare(password, results[0].password, function(err, res) {
                if(res){
                    if (results[0].is_student) {
                        response.cookie('cookieS', username, { maxAge: 900000, httpOnly: false, path: '/' });
                        req.session.user = username;
                        response.writeHead(200, {
                            'Content-Type': 'text/plain'
                        })
                        response.end("Student");
                    } else {
                        response.cookie('cookieF', username, { maxAge: 900000, httpOnly: false, path: '/' });
                        req.session.user = username;
                        response.writeHead(200, {
                            'Content-Type': 'text/plain'
                        })
                        response.end("Faculty");
                    }
                }
                else{
                    response.status(400).send("Incorrect Password!");
                }
        });
    }
});

});

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

//Route to update the account information when user visits the accounts page
app.put('/account', function (req, res) {
    var username = req.body.username;
    var name = req.body.name;
    var phoneNo = req.body.phoneNo;
    var aboutMe = req.body.aboutMe;
    var city = req.body.city;
    var country = req.body.country;
    var company = req.body.company;
    var school = req.body.school;
    var hometown = req.body.hometown;
    var languages = req.body.languages;
    var gender = req.body.gender;
    
    console.log("Inside account Information Put Request");
    console.log("Req Body : ", req.body);
    connection.query('UPDATE user SET name = ?, phone_number = ?,about_me = ?, city = ?, country =?, company = ?, school =?, hometown =?, languages =?,gender =? WHERE email_id = ?;', 
    [name, phoneNo, aboutMe, city, country, company, school, hometown, languages, gender, username], function (error, results, fields) {
            console.log();
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Success");
            }
        });
    });


//Route to get the account information when user visits the accounts Page
app.get('/account/:user', function (req, res) {
    console.log("Inside account get handler");
    var loggedInuser = req.params.user;
    console.log(loggedInuser);
    connection.query('SELECT * from user where email_id=?', [loggedInuser], function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
        } else {
            console.log(JSON.stringify(results));
            res.send(JSON.stringify(results));
        }
    });
})

//Route to get the account information when user visits the accounts Page
app.get('/coursehome/:user', function (req, res) {
    console.log("Inside account get handler");
    var loggedInuser = req.params.user;
    console.log(loggedInuser);
    connection.query('select course.course_name, course.course_dept, course.course_id,course.course_term, '+
    'student_courses.isWaitlist from course join student_courses where course.course_uid = student_courses.course_uid '+
    'and student_courses.email_id = ?;', [loggedInuser], function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
        } else {
            console.log(JSON.stringify(results));
            res.send(JSON.stringify(results));
        }
    });
})


//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");