//Announcement Module
var express = require('express');
var router = express.Router();
//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');

//Announcement Details

router.get('/inbox', requireAuth, function (req, res) {
    
    console.log("Inside Getting Inbox Messages for user Backend: " + req.user)
    if (req.user.role === 'student' || req.user.role === 'faculty') {
        kafka.make_request("get-messages", req, function (err, result) {
            if (err) {
                console.log("Error in getting inbox messages", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in getting inbox messages');
            }
            else {
                console.log('User Inbox Messages: ', JSON.stringify(result));
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
});

router.get('/sent', requireAuth, function (req, res) {
    
    console.log("Inside Getting Sent Messages for user Backend: " + req.user)
    if (req.user.role === 'student' || req.user.role === 'faculty') {
        kafka.make_request("get-sentmessages", req, function (err, result) {
            if (err) {
                console.log("Error in getting sent messages", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in getting sent messages');
            }
            else {
                console.log('User Sent Messages Result: ', JSON.stringify(result));
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
});


router.post('/',requireAuth, function (req, res) {
    console.log("Inside send message handler");

    kafka.make_request("send-message", req, function (err, result) {
        if (result) {
            console.log("Message sent successfully.");
            res.end('"Message sent successfully."');
        }

        if (err) {
            console.log("Unable to send message.", err);
            res.end('Unable to send message.');
        }
    });
});

router.get('/:type/id/:message_id', requireAuth, function (req, res) {
    console.log("Inside Getting Message Backend");

    if (req.user.role === 'student' || req.user.role === 'faculty') {
        kafka.make_request("get-message", req, function (err, result) {
            if (err) {
                console.log("Error in getting message", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in getting message');
            }
            else {
                console.log('Message Result: ', JSON.stringify(result));
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