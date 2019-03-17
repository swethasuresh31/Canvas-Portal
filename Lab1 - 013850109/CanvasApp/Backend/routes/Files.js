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
    getFiles(req, res)
})

router.post('/:courseUid', upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        getFiles(req, res)
    }
})

getFiles = (req, res) => {
    var fileNameList = [];
    var rootDir = 'public/files/courses/'
    var walkSync = function (dir, filelist) {
        var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
        filelist = filelist || [];
        fileNameList = fileNameList || [];
        files.forEach(function (file) {
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                filelist = walkSync(dir + '/' + file, filelist);
            }
            else {
                let displayPath = dir.slice(rootDir.length + 1) + '/' + file;
                if (file.startsWith(req.params.courseUid + '_')) {
                    fileNameList.push({
                        key: file.slice(req.params.courseUid.length + 1),
                        size: fs.statSync(dir + '/' + file).size,
                        modified: new Date(fs.statSync(dir + '/' + file).mtime).getTime()
                    })
                    filelist.push(file.slice(req.params.courseUid.length + 1));
                }
            }
        });
        return filelist;
    };
    walkSync(rootDir)
    console.log(fileNameList)
    res.send(fileNameList)
}

router.get('/:courseUid/:filename', function (req, res) {
    console.log("Inside student assignment get file handler");
    var name = decodeURI(req.params.filename);
    console.log(req.params.courseUid)
    var assignmentFileName = fs.readdirSync('public/files/courses').filter(fn => fn === req.params.courseUid + '_' + name)[0];

    console.log(assignmentFileName);
    if (assignmentFileName !== undefined) {
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

module.exports = router;