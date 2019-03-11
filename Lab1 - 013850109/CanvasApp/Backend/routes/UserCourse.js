var express = require('express');
var router = express.Router();
var connection = require('../db/connection')

router.get('/:user', function (req, res) {
    console.log("Inside usercourse " + req.query.role + " handler");
    if (req.query.role === 'student') {
        var loggedInuser = req.params.user;
        console.log(loggedInuser);
        connection.query('select * from course join student_courses where course.course_uid = student_courses.course_uid ' +
            'and student_courses.email_id = ?;', [loggedInuser], function (error, results, fields) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    console.log(JSON.stringify(results));
                    res.send(JSON.stringify(results));
                }
            });
    } else if (req.query.role === 'faculty') {
        var loggedInuser = decodeURI(req.params.user);
        console.log(loggedInuser);
        connection.query('select * from course where created_by = ?;', [loggedInuser], function (error, results, fields) {
            if (error) {
                res.status(500).send(error);
            } else {
                console.log(JSON.stringify(results));
                res.send(JSON.stringify(results));
            }
        });
    } else {
        console.log('No role specified');
        res.status(400).send('Page is only accesible for student or professor');
    }
})

router.delete('/', function (req, res) {
    let filledFieldName = (req.query.status === 'Waitlist') ? "total_waitlist" : "total_enrollment";

    let queryString = 'START TRANSACTION; ' +
        'UPDATE course SET ' + filledFieldName + '=' + filledFieldName + '-1 WHERE course_uid=' + req.query.courseUid +'; ' +
        'DELETE from student_courses WHERE email_id=? AND course_uid=?; ';
    
    if(this.shouldUpdateWaitlist(courseUid)){
        let studentId = fetchStudentToUpdate(courseUid);
        if( studentId !== ''){
            queryString += 'UPDATE student_courses SET isWaitlist=0 where course_uid=' + courseUid + ' AND email_id=' + studentId + '; ';
            queryString += 'UPDATE course SET total_enrollment=total_enrollment+1,total_waitlist=total_waitlist-1 WHERE course_uid=' + req.query.courseUid + '; ';        }
    }
    queryString += 'COMMIT;'
    console.log(queryString + "[" + decodeURI(req.query.user) + "," + req.query.courseUid + "," + req.query.status + "]");
    connection.query(queryString, [decodeURI(req.query.user), req.query.courseUid], function (error, results, fields) {
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            if(results[2].affectedRows !== 1) {
                res.status(404).send("Not found");
                connection.query("ROLLBACK;")
            }
            res.status(200).send("Success");
        }
    });
})

shouldUpdateWaitlist = (courseUid) => {
    connection.query('SELECT * FROM course WHERE course_uid=?', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            throw error;
        }
        if (results[0].total_waitlist === 0) {
            return false;
        }
        if(results[0].total_enrollment >= results[0].course_capacity){
            return false;
        }
        return true;
    });
}

fetchStudentToUpdate = (courseUid) => {
    connection.query('SELECT * FROM student_courses WHERE course_uid=? AND isWaitlist=1 ORDER BY course_uid LIMIT 1', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            throw error;
        }
        if (results.length === 1){
            return results[0].email_id;
        }
        return '';
    });
}


router.put('/', function (req, res) {
    console.log("Inside usercourse put handler: " + req.body.userId);
    let loggedInuser = decodeURI(req.body.userId);
    let courseUid = req.body.courseUid;
    let permissionNumber = req.body.permissionNumber;
    let isCourseWaitlist = false;
    let queryString = 'START TRANSACTION;';
    let forceInsert = false;
    
    try{
    //check permission number
    if (permissionNumber !== undefined && permissionNumber !== '') {
        if (this.isValidPN(permissionNumber, courseUid, res)) {
            forceInsert = true;
            queryString += 'UPDATE permission_code SET isUsed=true WHERE permission_code=' + permissionNumber + "; "
        }
    }

    if (!forceInsert) {

        let availability = this.availability(courseUid, res);
        //check availability
        if (availability === 'none') {
            res.status(403).send("Forbidden")
            return;
            //check waitlist
        }

        if (availability === 'waitlist') {
            //check waitlist
            isCourseWaitlist = true;
            queryString += 'UPDATE course SET total_waitlist = total_waitlist+1 WHERE course_uid=' + courseUid + "; "
        }

    }else{
        //check student already wailisted
        if(this.isStudentAlreadyWailisted(courseUid, loggedInuser, res)){
            //decrement total_waitlist 
            queryString += 'UPDATE course SET total_waitlist = total_waitlist-1 WHERE course_uid=' + courseUid + "; ";
            queryString += 'DELETE FROM student_courses WHERE course_uid=' + courseUid+ 'AND email_id='+loggedInuser+ '; ';
        }
    }
    if (!isCourseWaitlist) {
        queryString += 'UPDATE course SET total_enrollment = total_enrollment+1 WHERE course_uid=' + courseUid + "; "

    }

    queryString += 'INSERT INTO student_courses (email_id, course_uid , isWaitlist) VALUES (?,?,?); COMMIT;'

    //add student course
    console.log(queryString + "[" + loggedInuser + "," + courseUid + "," + isCourseWaitlist + "]");
    connection.query(queryString, [loggedInuser, courseUid, isCourseWaitlist], function (error, results, fields) {
        console.log("Final result:" + results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            res.status(200).send("Success");
        }
    });
}
catch(error){
    res.status(500).send(error);
}

})

isValidPN = (permissionNumber, courseUid, res) => {
    connection.query('SELECT * FROM permission_code WHERE permissionNumber=? AND course_uid=?', [permissionNumber, courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            res.status(500).send(error);
        }
        if (results.length === 0) {
            return false;
        }
        return results[0].isUsed === 0;
    });
}

availability = (courseUid, res) => {
    connection.query('SELECT * FROM course WHERE course_uid=?', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            throw error;
        }
        if (results.length === 0) {
            throw "Not found";
        }
        if (results[0].total_enrollment < results[0].course_capacity) {
            return 'available';
        }

        if (results[0].total_waitlist < results[0].waitlist_capacity) {
            return 'waitlist'
        }

        return 'none';
    });
}

isStudentAlreadyWailisted = (courseUid, user, res) => {
    connection.query('SELECT * FROM student_courses WHERE course_uid=? AND email_id=?', [courseUid,user], function (error, results, fields) {
        console.log(results);
        if (error) {
            throw error;
        }
        if (results.length === 0) {
           return false;
        }
        
        return results[0].isWaitlist !== 0;
    });
}



module.exports = router;