var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    var submission_details = []
    console.log('Inside Kafka Method Get Single Students Assignment Details By Assignment ID. Message ', message);
    var student = await Model.UserModel.find({ 'emailId': message.params.emailId }, { 'course': { '$elemMatch': { 'course_uid': message.params.course_uid } } });
    for (var j = 0; j < student[0].course[0].coursework_submissions.length; j++) {
        console.log(student[0].course[0].coursework_submissions[j].name + " : " + decodeURI(message.params.coursework_uid))
        if (student[0].course[0].coursework_submissions[j].name === decodeURI(message.params.coursework_uid)) {
            var coursework = student[0].course[0].coursework_submissions[j]
            await submission_details.push({
                'student_emailId': message.params.emailId,
                'assignment_name': coursework.name,
                'assignment_id': coursework._id,
                'assignment_score': coursework.score,
                'assignment_total': coursework.total_points,
            });
            break;
        }
    }

console.log("******************************************************************");
console.log(JSON.stringify(submission_details));
console.log("******************************************************************");


// var announcement = await course.announcements.find(announcement => String(announcement._id) === String(message.params.announcement_uid))
// console.log('Announcements kafka: ', JSON.stringify(announcement));
callback(null, submission_details);
}

exports.handle_request = handle_request;