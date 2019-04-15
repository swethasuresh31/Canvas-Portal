var Model = require('../DatabaseConnection');


async function handle_request(message, callback) {
    console.log('Inside Kafka Backend Add Quiz');
    console.log('Message: ', message);

    console.log("Adding quiz for course: " + message.params.course_uid)
    try {

        //check if quiz exists
        var course = await Model.CourseModel.findOne({'_id': message.params.course_uid, 'quizzes.name' : message.body.quizName})
        if(course) throw "quiz already exists"
        //fetching course details
        console.log("fetching course details");
        var course = await Model.CourseModel.findById(message.params.course_uid);
        //Adding the coursework details\
        console.log("adding quiz details to course")
        var addQuizDetails = await Model.CourseModel.update({ '_id': message.params.course_uid }, {
            $push: {
                quizzes:
                {
                    name: message.body.quizName,
                    due_date: message.body.dueDate,
                    total_points: message.body.questions.length,
                    instructions: message.body.instructions,
                }
            },
        })
        if (addQuizDetails.nModified > 0) {
            AddQuizQuestions(message, course, callback);
        }
    }
    catch (error) {
        console.error("Kafka backend - unable to save the quiz details: " + error);
        callback(error, null);
    }
}

//Adding the Quiz questions
AddQuizQuestions = async (message, course, callback) => {
    try {
        console.log("Adding questions into the quiz");
        message.body.questions.forEach(async (question) => {
            await Model.CourseModel.update({ '_id': message.params.course_uid, 'quizzes.name': message.body.quizName },
                {
                    $push:
                    {
                        'quizzes.$.questions':
                        {
                            question_number: question.questionNumber,
                            question: question.question,
                            first_option: question.firstOption,
                            second_option: question.secondOption,
                            third_option: question.thirdOption,
                            fourth_option: question.fourthOption,
                            answer: question.answer,

                        }
                    }
                })
        });
        MakeUserModelEntry(message, course, callback);
    }
    catch (error) {
        console.error("Kafka backend - unable to save the quiz questions");
        console.error(error);
        callback(error, null);
    }
}

//Adding Details into the enrolled students submission
MakeUserModelEntry = async (message, course, callback) => {
    try {

        console.log("---------------------------------------------------");
        console.log("Adding quiz into user coursework");
        console.log("-------------------------------------------------");
        console.log(course.enrolled);
        course.enrolled.forEach(async (enrolledUser) => {
            var updateduser = await Model.UserModel.update({ 'emailId': enrolledUser.emailId, 'course.course_uid':course._id }, {
                $push: {
                    'course.$.coursework_submissions':
                    {
                        name: message.body.quizName,
                        due_date: message.body.dueDate,
                        total_points: message.body.questions.length,
                    }
                },
            })
            console.log(updateduser);
        })

        callback(null, { updateStatus: "Success", data:course});
    }
    catch (error) {
        console.log("Kafka backend - unable to save coursework data in the student user table")
        callback(error, null);
    }
}

exports.handle_request = handle_request;