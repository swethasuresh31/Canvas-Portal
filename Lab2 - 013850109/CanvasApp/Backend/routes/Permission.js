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

router.get('/:course', requireAuth, function (req, res) {

    console.log('Inside Permission Code GET information!');
    if (req.user.role === 'faculty') {
        kafka.make_request("permission", req, function (err, result) {
            if (err) {
                console.log("Error in permission generation", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in permission generation');
            }
            else {
                console.log('Permission Code : ', JSON.stringify(result));
                res.writeHead(200, {
                    'Content-type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        });
    } else {
        console.log("Role is not authorized to generate permission number", err);
        res.writeHead(400, {
            'Content-type': 'text/plain'
        });
        res.end('Page is only accesible for faculty');
    }
});


module.exports = router;