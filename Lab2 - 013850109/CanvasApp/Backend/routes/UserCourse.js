//User Course Module
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

router.post('/', requireAuth, function (req, res) {
    console.log("Inside create course handler");

    kafka.make_request("add-course", req, function (err, result) {
        if (result !== null) {
            if (result.updateStatus === "Success") {
                console.log("Course added successfully.");
                res.end("Success");
            } else {
                console.log(result);
                res.status(500).send("Internal Server Error")
            }
        }else {
            console.log("Unable to add the course.", err);
            res.status(500).end("Course Already Enrolled");
        }
    });
});

router.delete('/', requireAuth, function (req, res) {
    console.log("Inside drop course handler");

    kafka.make_request("drop-course", req, function (err, result) {
        if (result) {
            if (result.updateStatus === "Success") {
                console.log("Course dropped successfully.");
                res.end("Success");
            } else {
                res.status(500).send("Internal Server Error")
            }
        }

        if (err) {
            console.log("Unable to drop the course.", err);
            res.end('Unable to drop the course.');
        }
    });
});

module.exports = router;