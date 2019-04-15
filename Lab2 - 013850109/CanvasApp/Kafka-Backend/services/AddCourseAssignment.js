
var Model = require('../DatabaseConnection');


async function handle_request(message, callback) {
    console.log('Inside Kafka Backend Add Assignment');
    console.log('Message: ', message);

    console.log("Adding assignment for course: " + message.params.course_uid)
    try {
        var course = await Model.CourseModel.findOne({'_id': message.params.course_uid, 'assignments.name' : message.body.assignmentName})
        if(course) throw "assignment already exists"
        //fetching course details
        console.log("fetching course details");
        var course = await Model.CourseModel.findById(message.params.course_uid);
        //Adding the coursework details\
        console.log("adding assignment details to course")
        var addQuizDetails = await Model.CourseModel.update({ '_id': message.params.course_uid }, {
            $push: {
                assignments:
                {
                    name: message.body.assignmentName,
                    due_date: message.body.dueDate,
                    total_points: message.body.points,
                    instructions: message.body.instructions,
                }
            },
        })
        if (addQuizDetails.nModified > 0) {
            MakeUserModelAssignmentEntry(message, course, callback);
        }
    }
    catch (error) {
        console.error("Kafka backend - unable to save the assignment details: " + error);
        callback(error, null);
    }
}

//Adding Details into the enrolled students submission
MakeUserModelAssignmentEntry = async (message, course, callback) => {
    try {

        console.log("---------------------------------------------------");
        console.log("Adding assignment into user coursework");
        console.log("-------------------------------------------------");
        console.log(course.enrolled);
        course.enrolled.forEach(async (enrolledUser) => {
            var updateduser = await Model.UserModel.update({ 'emailId': enrolledUser.emailId, 'course.course_uid':course._id }, {
                $push: {
                    'course.$.coursework_submissions':
                    {
                        name: message.body.assignmentName,
                        due_date: message.body.dueDate,
                        total_points: message.body.points,
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