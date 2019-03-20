var express = require('express');
var router = express.Router();
var connection = require('../db/connection')

router.post('/course', function (req, res) {
    console.log("Inside create course handler");
    var loggedInuser = req.body.user;
    let course_id = req.body.courseId;
    let course_term = req.body.courseTerm;
    let course_name = req.body.courseName;
    let course_deptcode = req.body.courseDeptCode;
    let course_dept = req.body.courseDept;
    let course_desc = req.body.courseDesc;
    let course_instructor=req.body.courseInstructor;
    let course_room = req.body.courseRoom;
    let course_capacity = req.body.courseCapacity;
    let waitlist_capacity = req.body.waitlistCapacity;
    
    console.log(loggedInuser);
    let querystring = 
    connection.query('INSERT INTO course(course_id,course_term,course_name,course_dept,course_dept_code,course_desc,course_room,course_capacity,waitlist_capacity,course_instructor,created_by)' + 
    ' VALUES(?,?,?,?,?,?,?,?,?,?,?);', [course_id,course_term,course_name,course_dept,course_deptcode,course_desc,course_room,course_capacity,waitlist_capacity,course_instructor,loggedInuser], function (error, results, fields) {
        console.log();
        if (error) {
            console.log("error occured"+error)
            res.status(500).send(error);
        } else {
            console.log("success"+res)
            res.status(200).send("Success");
        }
        });

});


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

    startDrop(filledFieldName, req.query.courseUid, req.query.user, res);

})

startDrop = (filledFieldName, courseUid, user, res) => {
    let queryString = 'START TRANSACTION; ' +
        'UPDATE course SET ' + filledFieldName + '=' + filledFieldName + '-1 WHERE course_uid=' + courseUid + '; ' +
        'DELETE from student_courses WHERE email_id=? AND course_uid=?; ';
    connection.query(queryString, [decodeURI(user), courseUid], function (error, results, fields) {
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            if (results[2].affectedRows !== 1) {
                res.status(404).send("Not found");
                connection.query("ROLLBACK;")
            } else {
                shouldUpdateWaitlist(courseUid, res)
            }
        }
    });
}

shouldUpdateWaitlist = (courseUid, res) => {
    connection.query('SELECT * FROM course WHERE course_uid=?', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        }
        if (results[0].total_waitlist === 0 || results[0].total_enrollment >= results[0].course_capacity) {
            console.log("Commiting drop")
            connection.query("COMMIT;")
            res.status(200).send("Success");
        } else {
            fetchStudentToUpdate(courseUid, res)
        }
    });
}

fetchStudentToUpdate = (courseUid, res) => {
    connection.query('SELECT * FROM student_courses WHERE course_uid=? AND isWaitlist=1 ORDER BY course_uid LIMIT 1', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            updateWaitlistForStudent(results[0].email_id, courseUid, res)
        }
    });
}

updateWaitlistForStudent = (studentId, courseUid, res) => {
    let queryString = 'UPDATE student_courses SET isWaitlist=0 where course_uid=' + courseUid + ' AND email_id=' + studentId + '; ';
    queryString += 'UPDATE course SET total_enrollment=total_enrollment+1,total_waitlist=total_waitlist-1 WHERE course_uid=' + courseUid + '; ';
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            console.log("Commiting drop")
            connection.query("COMMIT;")
            res.status(200).send("Success");
        }
    });
}


router.put('/', function (req, res) {
    console.log("Inside usercourse put handler: " + req.body.userId);
    let loggedInuser = decodeURI(req.body.userId);
    let courseUid = req.body.courseUid;
    let permissionNumber = req.body.permissionNumber;

    try {
        //kickoff add course flow
        startAddCourse(loggedInuser, courseUid, permissionNumber, res)
    }
    catch (error) {
        res.status(500).send(error);
    }

})

startAddCourse = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query("START TRANSACTION;", function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else if(permissionNumber === 'undefined') {
            checkAvailability(loggedInuser, courseUid, permissionNumber, res)
        }
        else {
        checkPermissionNumber(loggedInuser, courseUid, permissionNumber, res)
        }
    });
}

checkPermissionNumber = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query('SELECT * FROM permission_code WHERE permission_code=? AND course_uid=? AND isUsed=0', [permissionNumber, courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else if (results.length === 1) {
            updatePermissionNumber(loggedInuser, courseUid, permissionNumber, res)
        } else {
            checkAvailability(loggedInuser, courseUid, permissionNumber, res)
        }
    });
}

updatePermissionNumber = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query('UPDATE permission_code SET isUsed=1 WHERE permission_code=?', [permissionNumber], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            checkStudentAlreadyWailisted(loggedInuser, courseUid, permissionNumber, res)
        }
    });
}

checkAvailability = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query('SELECT * FROM course WHERE course_uid=?', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else if (results[0].total_enrollment < results[0].course_capacity) {
            updateEnrollment(loggedInuser, courseUid, permissionNumber, res)
        } else if (results[0].total_waitlist < results[0].waitlist_capacity) {
            updateWaitist(loggedInuser, courseUid, permissionNumber, res)
        } else {
            connection.query("ROLLBACK;")
            res.status(403).send("Forbidden")
        }
    });
}

//only for valid permission code
checkStudentAlreadyWailisted = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query('SELECT * FROM student_courses WHERE course_uid=? AND email_id=?', [courseUid, loggedInuser], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else if (results.length === 0) {
            updateEnrollment(loggedInuser, courseUid, permissionNumber, res)
        } else if(results[0].isWaitlist === 1){
            removeFromWaitlist(loggedInuser, courseUid, permissionNumber, res)
        } else {
            connection.query("ROLLBACK;")
            res.status(403).send("Forbidden")
        }
    });
}

updateWaitist = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query('UPDATE course SET total_waitlist = total_waitlist+1 WHERE course_uid=?', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            insertStudentCourse(loggedInuser, courseUid, permissionNumber, true, res)
        }
    });
}

updateEnrollment = (loggedInuser, courseUid, permissionNumber, res) => {
    connection.query('UPDATE course SET total_enrollment = total_enrollment+1 WHERE course_uid=?', [courseUid], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            insertStudentCourse(loggedInuser, courseUid, permissionNumber, false, res)
        }
    });
}

removeFromWaitlist = (loggedInuser, courseUid, permissionNumber, res) => {
    let queryString = 'UPDATE course SET total_waitlist = total_waitlist-1,total_enrollment = total_enrollment+1 WHERE course_uid=' + courseUid + '; ';
    queryString += 'UPDATE student_courses SET isWaitlist=0 WHERE course_uid=' + courseUid + 'AND email_id=' + loggedInuser + '; ';
    connection.query(queryString, function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            console.log("Commiting add")
            connection.query("COMMIT;")
            res.status(200).send("Success")
        }
    });
}

insertStudentCourse = (loggedInuser, courseUid, permissionNumber, isWaitlist, res) => {
    connection.query('INSERT INTO student_courses (email_id, course_uid , isWaitlist) VALUES (?,?,?);', [loggedInuser,courseUid,isWaitlist], function (error, results, fields) {
        console.log(results);
        if (error) {
            console.log(error);
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            console.log("Commiting add insert")
            connection.query("COMMIT;")
            res.status(200).send("Success")
        }
    });
}


module.exports = router;