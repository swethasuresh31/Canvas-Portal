var express = require('express');
var router = express.Router();
var connection = require('../db/connection')

router.get('/:courseUid', function (req, res) {
    console.log("Getting announcements for course: " + req.params.courseUid)
    connection.query('select * from announcements,course where course.course_uid = announcements.course_uid and announcements.course_uid = ?;', [req.params.courseUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})
    router.get('/id/:announcementUid', function (req, res) {
    console.log("Getting announcements for announcement id:" + req.params.announcementUid)
    connection.query('select * from announcements,course where course.course_uid = announcements.course_uid and announcements.announcement_uid=?;', [req.params.announcementUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results[0]));
        }
    });
})
router.post('/:courseUid', function (req, res) {
    console.log("Posting announcement for course: " + req.params.courseUid)
    connection.query('insert into announcements (course_uid, header,body,announcement_TS) values(?,?,?,NOW());', [req.params.courseUid,req.body.subject,req.body.body], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.status(200).send("Success");
        }
    });
})
module.exports = router;