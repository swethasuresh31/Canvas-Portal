//assignment Module
var express = require('express');
var router = express.Router();

//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });
//Kafka
var kafka = require('../kafka/client');
var multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/assignments')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({ storage });


//Add assignment Details
router.post('/:course_uid',requireAuth, function (req, res) {
    console.log("Inside create assignment handler");
    console.log("Request Data: "+req.body);
    kafka.make_request("add-assignment", req, function (err, result) {
        if (result) {
            console.log("assignment saved successfully.");
            res.end('assignment saved successfully.');
        }

        if (err) {
            console.log("Unable to create the assignment.", err);
            res.end('Unable to create the assignment.');
        }
    });
});

// //Update assignment Score
// router.post('/:course_uid/result',requireAuth, function (req, res) {
//     console.log("Inside update assignment score handler");
//     console.log("Request Data: "+req.body);
//     kafka.make_request("update-assignmentscore", req, function (err, result) {
//         if (result) {
//             console.log("assignment score updated successfully.");
//             res.end('assignment score updated successfully.');
//         }

//         if (err) {
//             console.log("Unable to update assignment score.", err);
//             res.end('Unable to update assignment score.');
//         }
//     });
// });

router.post('/:courseUid/:courseworkUid', requireAuth, upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        console.log("posting assignment for course: " + req.params.courseUid)
        res.send("Success")
    }
})

module.exports = router;