var express = require('express');
var router = express.Router();
var connection = require('../db/connection')

router.get('/:courseUid', function (req, res) {
    console.log("Getting announcements for course: " + req.params.courseUid)
    connection.query('select * from coursework where course_uid = ?', [req.params.courseUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.get('/:courseUid/:courseworkUid', function (req, res) {
    console.log("Getting announcements for course: " + req.params.courseUid)
    connection.query('select * from coursework where coursework_uid=?', [req.params.courseworkUid], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.send(JSON.stringify(results));
        }
    });
})

router.get('/:courseUid/questions/:courseworkUid', function (req, res) {
    console.log("Getting announcements for course: " + req.params.courseUid)
    connection.query('select * from quiz_questions where coursework_uid=?', [req.params.courseworkUid], function (error, results, fields) {
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
    connection.query('START TRANSACTION; insert into coursework (course_uid, coursework_name,instructions,due_date,total_points) values(?,?,?,?,?);', [req.params.courseUid, req.body.quizName, req.body.instructions, dueDateMySql, req.body.questions.length], function (error, results, fields) {
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