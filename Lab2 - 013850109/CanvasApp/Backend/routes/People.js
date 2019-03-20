var express = require('express');
var router = express.Router();
// var connection = require('../db/connection')
const UserModel = require('../model/model');



// router.get('/course/:courseUid', function (req, res) {
//     console.log("Getting people for course: " + req.params.courseUid)
//     connection.query('select * from user,course , student_courses where user.email_id=student_courses.email_id and course.course_uid=student_courses.course_uid and course.course_uid=? and user.email_id in (select email_id from student_courses where course_uid = ?);', [req.params.courseUid,req.params.courseUid], function (error, results, fields) {
//         if (error) {
//             console.log(error)
//             res.status(500).send(error);
//         } else {
//             res.send(JSON.stringify(results));
//         }
//     });
// })

// router.get('/id/:user', function (req, res) {
//     console.log("Inside account get handler");
//     var loggedInuser = decodeURI(req.params.user);
//     console.log(loggedInuser);
//     connection.query('SELECT * from user where email_id=?', [loggedInuser], function (error, results, fields) {
//         if (error) {
//             res.status(500).send(error);
//         } else {
//             console.log(JSON.stringify(results));
//             res.send(JSON.stringify(results));
//         }
//     });
// })

router.get('/', async function (req, res) {
    console.log("Inside account get handler");
    var loggedInuser = decodeURI(req.user.emailId);
    console.log(loggedInuser);
    try {
        const user = await UserModel.findOne({ emailId: loggedInuser });
        if (!user) {
            throw "Not found"
        } else {
            res.send(JSON.stringify(user));
        }
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;