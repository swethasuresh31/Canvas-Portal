var express = require('express');
var router = express.Router();
var connection = require('../db/connection')

router.get('/:courseUid/:user', function (req, res) {
    console.log("Getting grades of the student"+decodeURI(req.params.user)+" for course: " + req.params.courseUid)
    let loggedInUser = decodeURI(req.params.user);
    connection.query('select * from coursework left join student_coursework on coursework.coursework_uid = student_coursework.coursework_uid'+
    ' and student_coursework.email_id=? having course_uid=?;', [loggedInUser,req.params.courseUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

module.exports = router;