//Grades Module
var express = require('express');
var router = express.Router();
//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');

//Announcement Details

router.get('/:course_uid', requireAuth, function (req, res) {
    
    console.log("Inside Getting announcements for course Backend: " + req.params.course_uid)
    if (req.user.role === 'student') {
        kafka.make_request("get-studentgrade", req, function (err, result) {
            if (err) {
                console.log("Error in getting announcements", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in getting student grade');
            }
            else {
                console.log('Student Grade Results: ', JSON.stringify(result));
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
        res.end('Page is only accesible for faculty');
    }
});



// router.post('/:course_uid',requireAuth, function (req, res) {
//     console.log("Inside create announcement handler");

//     kafka.make_request("add-announcement", req, function (err, result) {
//         if (result) {
//             console.log("announcement saved successfully.");
//             res.end('announcement saved successfully.');
//         }

//         if (err) {
//             console.log("Unable to create the announcement.", err);
//             res.end('Unable to create the announcement.');
//         }
//     });
// });

// router.get('/:course_uid/id/:announcement_uid', requireAuth, function (req, res) {
//     console.log("Inside Getting announcements for announcement id Backend");

//     if (req.user.role === 'student' || req.user.role === 'faculty') {
//         kafka.make_request("get-announcement", req, function (err, result) {
//             if (err) {
//                 console.log("Error in getting announcement", err);
//                 res.writeHead(400, {
//                     'Content-type': 'text/plain'
//                 });
//                 res.end('Error in getting announcement');
//             }
//             else {
//                 console.log('Course Announcement Result: ', JSON.stringify(result));
//                 res.writeHead(200, {
//                     'Content-type': 'application/json'
//                 });
//                 if(result === null) result = []
//                 res.end(JSON.stringify(result));
//             }
//         });
//     } else {
//         console.log("No role mentioned for the user");
//         res.writeHead(400, {
//             'Content-type': 'text/plain'
//         });
//         res.end('Page is only accesible for student or faculty');
//     }
// })

module.exports = router;