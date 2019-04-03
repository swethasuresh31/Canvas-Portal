//submit booking.js - Submit booking route module
var express = require('express');
var router = express.Router();
//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');

//owner dashboard details

router.get('/:user', requireAuth, function (req, res) {

    console.log('Inside User Course GET dashboard information!');
    if (req.query.role === 'student' || req.query.role === 'faculty') {
        kafka.make_request("course-dashboard", req.user, function (err, result) {
            if (err) {
                console.log("Error in course dashboard", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in course dashboard');
            }
            else {
                console.log('Course Details1: ', JSON.stringify(result));
                res.writeHead(200, {
                    'Content-type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        });
    } else {
        console.log("No role mentioned for the user", err);
        res.writeHead(400, {
            'Content-type': 'text/plain'
        });
        res.end('Page is only accesible for student or professor');
    }
});

router.post('/course',requireAuth, function (req, res) {
    console.log("Inside create course handler");

    kafka.make_request("create-course", req, function (err, result) {
        if (result) {
            console.log("Course saved successfully.");
            res.end('Course saved successfully.');
        }

        if (err) {
            console.log("Unable to create the course.", err);
            res.end('Unable to create the course.');
        }
    });
});

module.exports = router;