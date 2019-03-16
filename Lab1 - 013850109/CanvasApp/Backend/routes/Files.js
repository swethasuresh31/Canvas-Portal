var express = require('express');
var router = express.Router();
var fs = require('fs');
var connection = require('../db/connection')

router.get('/:courseUid', function (req, res) {
    console.log("Getting files for course: " + req.params.courseUid)
    // connection.query('select * from user left join student_coursework on student_coursework.coursework_uid=? having user.is_student=1 and user.email_id in (select email_id from student_courses where course_uid = ?);', [req.params.courseworkUid,req.params.courseUid], function (error, results, fields) {
    //     if (error) {
    //         console.log(error)
    //         res.status(500).send(error);
    //     } else {
    //         res.send(JSON.stringify(results));
    //     }
    // });
    var fileNameList = [];
    var rootDir='public/files/course/' + req.params.courseUid + '/'
    var walkSync = function(dir, filelist) {
        var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
        filelist = filelist || [];
        fileNameList = fileNameList || [];
        files.forEach(function(file) {
          if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else {
            let displayPath = dir.slice(rootDir.length + 1) + '/' + file;
            fileNameList.push({
                key: displayPath,
                size: fs.statSync(dir + '/' + file).size,
                modified: new Date(fs.statSync(dir + '/' + file).mtime).getTime()
            })
            filelist.push(file);
          }
        });
        return filelist;
      };
      walkSync(rootDir)
      console.log(fileNameList)
      res.send(fileNameList)
})

router.get('/:courseUid/:courseworkUid/:user', function (req, res) {
    console.log("Inside student assignment get handler");
    var loggedInuser = decodeURI(req.params.user);
    console.log(loggedInuser);
    connection.query('SELECT * from student_coursework,coursework where student_coursework.coursework_uid=coursework.coursework_uid and student_coursework.coursework_uid=? and student_coursework.email_id=?', [req.params.courseworkUid,req.params.user], function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
        } else {
            console.log(JSON.stringify(results));
            res.send(JSON.stringify(results));
        }
    });
})

router.get('/file/:courseUid/:courseworkUid/:user', function (req, res) {
    console.log("Inside student assignment get file handler");
    var loggedInuser = decodeURI(req.params.user);
    console.log(req.params.courseUid)
    var assignmentFileName = fs.readdirSync('public/files').filter(fn => fn.startsWith(req.params.courseUid + '-' + req.params.courseworkUid + '-' + loggedInuser))[0];

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
          
    }
})

router.post('/:courseUid/:courseworkUid/:studentCourseworkUid', function (req, res) {
    let assignmentInfo = req.body.assignmentInfo
    console.log(assignmentInfo)
    connection.query('insert into student_coursework(studentcourses_uid, coursework_uid, email_id, scored_points)' +
    ' values (?,?,?,?) ON DUPLICATE KEY UPDATE scored_points=?;', [assignmentInfo.studentcourses_uid, assignmentInfo.coursework_uid, assignmentInfo.email_id, req.body.scoredPoints, req.body.scoredPoints], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.status(200).send("Success")
        }
    });
})

module.exports = router;