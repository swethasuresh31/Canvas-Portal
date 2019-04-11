//Course Files
var express = require('express');
var router = express.Router();
//Passport authentication
var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false});
//Kafka
var kafka = require('../kafka/client');

var fs = require('fs');

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

router.get('/:course_uid', requireAuth, function (req, res) {
    console.log("Getting files for course: " + req.params.course_uid)
    getFiles(req, res)
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
                if (file.startsWith(req.params.course_uid + '_')) {
                    fileNameList.push({
                        key: file.slice(req.params.course_uid.length + 1),
                        size: fs.statSync(dir + '/' + file).size,
                        modified: new Date(fs.statSync(dir + '/' + file).mtime).getTime()
                    })
                    filelist.push(file.slice(req.params.course_uid.length + 1));
                }
            }
        });
        return filelist;
    };
    walkSync(rootDir)
    console.log(fileNameList)
    res.send(fileNameList)
}

router.get('/:course_uid/:filename', function (req, res) {
    console.log("Inside student assignment get file handler");
    var name = decodeURI(req.params.filename);
    console.log(req.params.course_uid)
    var FileName = fs.readdirSync('public/files/courses').filter(fn => fn === req.params.course_uid + '_' + name)[0];

    console.log(FileName);
    if (FileName !== undefined) {
        let options = {
            root: 'public/files/courses',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        res.sendFile(FileName, options, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Sent:', FileName);
            }
        });

    }
})


router.post('/:course_uid', requireAuth, upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        getFiles(req, res)
    }
})

// router.post('/img', upload.single('file'), function (req, res) {
//     console.log(req.file)
//     if (!req.file) {
//         res.status(500).send("No file");
//     } else {
//         res.send(req.file.originalname)
//     }
// })

module.exports = router;