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

router.get('/', requireAuth, function (req, res) {

    console.log('Inside Course Metadata GET dashboard information!');
    if (req.user.role === 'student') {
        kafka.make_request("course-metadata", req, function (err, result) {
            if (err) {
                console.log("Error in course metadata", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in course metadata');
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
        console.log("No role mentioned for the user");
        res.writeHead(400, {
            'Content-type': 'text/plain'
        });
        res.end('Page is only accesible for student');
    }
});

module.exports = router;