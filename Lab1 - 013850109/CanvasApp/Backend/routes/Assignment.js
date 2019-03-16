var express = require('express');
var router = express.Router();
var connection = require('../db/connection')
var path = require('path')

var multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({ storage });

router.get('/:courseUid', function (req, res) {
    console.log("Getting assignments for course: " + req.params.courseUid)
    connection.query('select * from coursework where course_uid = ? and coursework_type=?;', [req.params.courseUid, 'assignment'], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.get('/:courseUid/:courseworkUid', function (req, res) {
    console.log("Getting assignment: " + req.params.courseworkUid)
    connection.query('select * from coursework where coursework_uid=?;', [req.params.courseworkUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.post('/:courseUid/:courseworkUid/:user', upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        console.log("posting assignment for course: " + req.params.courseUid)
        connection.query('select * from student_courses where course_uid=? and email_id=?;', [req.params.courseUid, req.params.user], function (error, results, fields) {
            if (error) {
                console.log(error || results.length !== 1)
                res.status(500).send(error);
            } else {
                console.log(results[0].studentcourses_uid)
                addAssignmentResult(results[0].studentcourses_uid, req.params.courseworkUid, req.params.user, 0, res)

            }
        });
    }
})

addAssignmentResult = (studentcoursesUid, courseworkUid, emailId, totalPoints, res) => {
    console.log(studentcoursesUid + '' + courseworkUid + emailId + totalPoints)
    connection.query('insert into student_coursework(studentcourses_uid, coursework_uid, email_id, scored_points)' +
        ' values (?,?,?,?) ON DUPLICATE KEY UPDATE scored_points=?;', [studentcoursesUid, courseworkUid, emailId, totalPoints, totalPoints], function (error, results, fields) {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            } else {
                res.status(200).send("Success")
            }
        });
}

router.post('/:courseUid', function (req, res) {
    console.log("posting faculty assignment")
    let dueDateMySql = new Date(req.body.dueDate).toISOString().slice(0, 19).replace('T', ' ')
    console.log("Posting announcement for course: " + req.params.courseUid)
    connection.query('insert into coursework (course_uid, coursework_name,coursework_type,instructions,due_date,total_points) values(?,?,?,?,?,?);', [req.params.courseUid, req.body.assignmentName, 'assignment', req.body.instructions, dueDateMySql, req.body.points], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.status(200).send("Success");
        }
    });
})

module.exports = router;