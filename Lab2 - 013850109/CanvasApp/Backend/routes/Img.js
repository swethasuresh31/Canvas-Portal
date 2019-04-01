var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:user', function (req, res) {
    console.log("Inside user get image handler");
    var name = decodeURI(req.params.user);
    console.log(req.params.courseUid)
    var imgName = fs.readdirSync('public/img').filter(fn => fn.startsWith(name))[0];

    console.log(imgName);
    if (imgName === undefined) imgName = "default_profile_img.jpg"
    let options = {
        root: 'public/img',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile(imgName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', imgName);
        }
    });

})

module.exports = router;