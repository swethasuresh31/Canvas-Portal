//Students Assignment Module - Faculty Landing
var express = require('express');
var router = express.Router();
var fs = require('fs');

//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');


//To get all the enrolled students in the courses along with their coursework submission details
router.get('/:course_uid/:coursework_uid', requireAuth, function (req, res) {
    
    console.log("Inside Getting People and their coursework submissions Backend: " + req.params.course_uid +':'+req.params.coursework_uid)
    if (req.user.role === 'faculty') {
        kafka.make_request("get-studentsassignment", req, function (err, result) {
            if (err) {
                console.log("Error in getting student coursework", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in getting student coursework');
            }
            else {
                console.log('Faculty Page Grade Results: ', JSON.stringify(result));
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

//To get all the enrolled students in the courses along with their coursework submission details
router.get('/:course_uid/:coursework_uid/:emailId', requireAuth, function (req, res) {
    
    console.log("Inside Getting coursework submissions by student Backend: " + req.params.course_uid +':'+decodeURI(req.params.coursework_uid))
    if (req.user.role === 'faculty') {
        kafka.make_request("get-student-assignment", req, function (err, result) {
            if (err) {
                console.log("Error in getting student coursework", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in getting student coursework');
            }
            else {
                console.log('Faculty Page Grade Results: ', JSON.stringify(result));
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

router.get('/file/:courseUid/:courseworkUid/:user', function (req, res) {
    console.log("Inside student assignment get file handler");
    var loggedInuser = decodeURI(req.params.user);
    console.log(req.params.courseUid)
    var assignmentFileName = fs.readdirSync('public/files/assignments').filter(fn => fn.startsWith(req.params.courseUid + '-' + decodeURI(req.params.courseworkUid) + '-' + loggedInuser))[0];

    console.log(loggedInuser);
    console.log(assignmentFileName);
    if(assignmentFileName !== undefined) {
        let options = {
            root: 'public/files/assignments',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
          };
          res.sendFile(assignmentFileName, options, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Sent:', assignmentFileName);
            }
          });
          
    } else {
        console.log("File not found")
        res.status(404).send("File not found")
    }
})

//Update assignment Score
router.post('/:course_uid/:assignment_name/:emailId',requireAuth, function (req, res) {
    console.log("Inside update assignment score handler");
    console.log("Request Data: "+req.body);
    kafka.make_request("update-assignmentscore", req, function (err, result) {
        if (result) {
            console.log("assignment score updated successfully.");
            res.end('assignment score updated successfully.');
        }

        if (err) {
            console.log("Unable to update assignment score.", err);
            res.end('Unable to update assignment score.');
        }
    });
});

// router.post('/:courseUid/:courseworkUid', requireAuth, upload.single('file'), function (req, res) {
//     console.log(req.file)
//     if (!req.file) {
//         res.status(500).send("No file");
//     } else {
//         console.log("posting assignment for course: " + req.params.courseUid)
//         res.send("Success")
//     }
// })

module.exports = router;