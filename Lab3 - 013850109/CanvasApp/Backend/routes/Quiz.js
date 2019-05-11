var express = require('express');
var router = express.Router();
var connection = require('../db/connection')

router.get('/:courseUid', function (req, res) {
    console.log("Getting quizzes for course: " + req.params.courseUid)
    connection.query('select * from coursework where course_uid = ? and coursework_type=?;', [req.params.courseUid,'quiz'], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.get('/:courseUid/:courseworkUid', function (req, res) {
    console.log("Getting quiz: " + req.params.courseUid)
    connection.query('select * from coursework where coursework_uid=?;', [req.params.courseworkUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.post('/:courseUid/:courseworkUid', function (req, res) {
    console.log("posting quiz for course: " + req.params.courseUid)
    connection.query('select * from student_courses where course_uid=? and email_id=?;', [req.params.courseUid, req.body.user], function (error, results, fields) {
        if (error) {
            console.log(error || results.length !== 1)
            res.status(500).send(error);
        } else {
            addQuizResult(results[0].studentcourses_uid, req.params.courseworkUid, req.body.user, req.body.totalPoints, res);
        }
    });
})

addQuizResult = (studentcoursesUid, courseworkUid, emailId, totalPoints, res) => {
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

router.get('/:courseUid/questions/:courseworkUid', function (req, res) {
    console.log("Getting questions for quiz: " + req.params.courseworkUid)
    connection.query('select * from quiz_questions where coursework_uid=?;', [req.params.courseworkUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.post('/:courseUid', function (req, res) {
    console.log(req.body.questions)
    let dueDateMySql = new Date(req.body.dueDate).toISOString().slice(0, 19).replace('T', ' ')
    console.log("Posting announcement for course: " + req.params.courseUid)
    connection.query('START TRANSACTION; insert into coursework (course_uid, coursework_name,coursework_type,instructions,due_date,total_points) values(?,?,?,?,?,?);', [req.params.courseUid, req.body.quizName, 'quiz', req.body.instructions, dueDateMySql, req.body.questions.length], function (error, results, fields) {
        if (error) {
            console.log(error)
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            getQuizId(req.params.courseUid, req.body.quizName, req.body.questions, res);
        }
    });
})

getQuizId = (courseUid, name, questions, res) => {
    connection.query('select * from coursework where course_uid=? and coursework_name=?;', [courseUid, name], function (error, results, fields) {
        if (error) {
            console.log(error)
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            if (results.length !== 1) {
                console.log(error)
                connection.query("ROLLBACK;")
                res.status(500).send(error);
            } else {
                insertQuestions(results[0].coursework_uid,questions,res);
            }
        }
    });
}

insertQuestions = (courseworkUid, questions, res) => {

    let queryString = ''
    
    questions.forEach(question => {
        queryString += 'insert into quiz_questions(coursework_uid, question_number, question, first_option, second_option, third_option, fourth_option, answer)' +
                        'values(' + courseworkUid +','+ question.questionNumber+',"'+question.question+'","'+question.firstOption+'","'+question.secondOption+'","'+
                        question.thirdOption+'","'+question.fourthOption+'","'+question.answer+'"); '
    });

    console.log(queryString)
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            connection.query("ROLLBACK;")
            res.status(500).send(error);
        } else {
            connection.query("COMMIT;")
                res.status(200).send("Success");
        }
    });
}
module.exports = router;