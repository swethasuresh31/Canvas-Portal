//Quiz Module
var express = require('express');
var router = express.Router();
//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');

//Add Quiz Details
router.post('/:course_uid',requireAuth, function (req, res) {
    console.log("Inside create quiz handler");
    console.log("Request Data: "+req.body);
    kafka.make_request("add-quiz", req, function (err, result) {
        if (result) {
            console.log("Quiz saved successfully.");
            res.end('Quiz saved successfully.');
        }

        if (err) {
            console.log("Unable to create the quiz.", err);
            res.end('Unable to create the quiz.');
        }
    });
});

//Update Quiz Score
router.post('/:course_uid/result',requireAuth, function (req, res) {
    console.log("Inside update quiz score handler");
    console.log("Request Data: "+req.body);
    kafka.make_request("update-quizscore", req, function (err, result) {
        if (result) {
            console.log("Quiz score updated successfully.");
            res.end('Quiz score updated successfully.');
        }

        if (err) {
            console.log("Unable to update quiz score.", err);
            res.end('Unable to update quiz score.');
        }
    });
});

module.exports = router;