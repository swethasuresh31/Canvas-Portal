//Course Module
var express = require('express');
var router = express.Router();
//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');

//owner dashboard details

router.get('/', requireAuth, function (req, res) {

    console.log('Inside Course Search!');
    if (req.user.role === 'student') {
        kafka.make_request("course", req, function (err, result) {
            if (err) {
                console.log("Error in course search", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in course search');
            }
            else {
                console.log('Course Search Results: ', JSON.stringify(result));
                res.writeHead(200, {
                    'Content-type': 'application/json'
                });
                if(result === null) result = []
                res.end(JSON.stringify(result));
            }
        });
    } else {
        console.log("No role mentioned for the user");
        res.writeHead(400, {
            'Content-type': 'text/plain'
        });
        res.end('Page is only accesible for student');
    }
});

router.post('/',requireAuth, function (req, res) {
    console.log("Inside create course handler");

    kafka.make_request("create-course", req, function (err, result) {
        if (result) {
            console.log("Course saved successfully.");
            res.end('Course saved successfully.');
        } else if(result === null){
            console.log("Course already exists.");
            res.status(210).end('Course already exists!');
        }

        if (err) {
            console.log("Unable to create the course.", err);
            res.end('Unable to create the course.');
        }
    });
});

router.get('/:course_uid', requireAuth, function (req, res) {
    console.log("Inside course home handler");

    if (req.user.role === 'student' || req.user.role === 'faculty') {
        kafka.make_request("course-home", req, function (err, result) {
            if (err) {
                console.log("Error in course home", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in course home');
            }
            else {
                console.log('Course Home Results: ', JSON.stringify(result));
                res.writeHead(200, {
                    'Content-type': 'application/json'
                });
                
                if(result === null) result = []
                res.end(JSON.stringify(result));
            }
        });
    } else {
        console.log("No role mentioned for the user");
        res.writeHead(400, {
            'Content-type': 'text/plain'
        });
        res.end('Page is only accesible for student or faculty');
    }
})

module.exports = router;