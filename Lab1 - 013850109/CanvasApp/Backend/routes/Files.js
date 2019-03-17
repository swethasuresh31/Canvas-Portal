var express = require('express');
var router = express.Router();
var fs = require('fs');
var connection = require('../db/connection')

var multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/courses')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({ storage });


router.get('/:courseUid', function (req, res) {
    console.log("Getting files for course: " + req.params.courseUid)
    var fileNameList = [];
    var rootDir='public/files/courses/'
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
            if(file.startsWith(req.params.courseUid + '_'))
            filelist.push(file);
          }
        });
        return filelist;
      };
      walkSync(rootDir)
      console.log(fileNameList)
      res.send(fileNameList)
})

router.post('/:courseUid/:courseworkUid/:user', upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        console.log("posting file for course: " + req.params.courseUid)
       res.send("Success")
    }
})

router.get('/:courseUid/:filename', function (req, res) {
    console.log("Inside student assignment get file handler");
    var name = decodeURI(req.params.filename);
    console.log(req.params.courseUid)
    var assignmentFileName = fs.readdirSync('public/files/courses').filter(fn => fn.startsWith(req.params.courseUid + '_' + filename))[0];

    console.log(loggedInuser);
    console.log(assignmentFileName);
    if(assignmentFileName !== undefined) {
        let options = {
            root: 'public/files/courses',
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