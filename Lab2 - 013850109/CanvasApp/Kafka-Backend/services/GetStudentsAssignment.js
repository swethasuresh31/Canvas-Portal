var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    console.log('Inside Kafka Method Get Students Assignment Details By Assignment ID. Message ', message);
    await Model.CourseModel.findById(message.params.course_uid, async (err, course) => {
        if (err) {
            console.log("Unable to get the assignments.", err);
            callback(err, null);
        }
        else {
            var submission_details = [];
            for (var i = 0; i < course.enrolled.length; i++) {
                var enrolledUser = course.enrolled[i]
                var student = await Model.UserModel.find({ 'emailId': enrolledUser.emailId}, {'course': { '$elemMatch': { 'course_uid': message.params.course_uid } } });
                // var studentString = await JSON.stringify(studentModel)
                // var student = await JSON.parse(studentString)
                // var student = Array.from(studentModel)[0]
                // var course = Array.from(student.course[0])
                console.log("******************************************************************");
                console.log(JSON.stringify(student[0]));
                console.log(JSON.stringify(student[0].course[0].coursework_submissions.length));
                console.log("******************************************************************");
                for(var j = 0; j < student[0].course[0].coursework_submissions.length; j++) {
                    console.log(student[0].course[0].coursework_submissions[j].name + " : " + decodeURI(message.params.coursework_uid))
                    if(student[0].course[0].coursework_submissions[j].name === decodeURI(message.params.coursework_uid)) {
                        var coursework = student[0].course[0].coursework_submissions[j]
                        await submission_details.push({
                            'student_emailId' : enrolledUser.emailId,
                            'student_name': enrolledUser.name,
                            'assignment_name' : coursework.name,
                            'assignment_id' : coursework._id,
                            'assignment_score' : coursework.score,
                        });
                        break;
                    }
                }
            
            }
                console.log("******************************************************************");
                console.log(JSON.stringify(submission_details));
                console.log("******************************************************************");
           
            
            // var announcement = await course.announcements.find(announcement => String(announcement._id) === String(message.params.announcement_uid))
            // console.log('Announcements kafka: ', JSON.stringify(announcement));
             callback(null, submission_details);
        }
    });
}

 exports.handle_request = handle_request;