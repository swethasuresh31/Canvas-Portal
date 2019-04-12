var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    console.log('Inside Kafka Backend Update Assignment Score');
    console.log('Message: ', message);
    try {
        console.log("***********" + message.params.emailId + " >> " + message.params.course_uid + " >> " + message.body.name + " >> " + message.body.score + "***********************")

        var user = await Model.UserModel.findOne({ emailId: message.params.emailId });
        var assignmentName = decodeURI(message.params.assignment_name)
        var i = 0;
        var j= 0;
        for (; i < user.course.length; i++) {
            console.log(user.course[i].course_uid + ":" + message.params.course_uid);
            if (String(user.course[i].course_uid) === String(message.params.course_uid)) {
                for (; j < user.course[i].coursework_submissions.length; j++) {
                    console.log(user.course[i].coursework_submissions[j].name + ":" + assignmentName);

                    if (String(user.course[i].coursework_submissions[j].name) === String(assignmentName)) {

                        console.log("Assignment found!!" + j);
                        break;
                    }
                }
                console.log("course found!!" + i);
                break;
            }
        }
        submissionsScoreField = 'course.' + i + '.coursework_submissions.' + j + '.score';
        console.log(submissionsScoreField);
        submissionField = 'course.coursework_submissions.name'

        var updatedUser = await Model.UserModel.update({ '_id': user._id, [submissionField]: assignmentName },
            { $set: { [submissionsScoreField]: message.body.scoredPoints } })

        console.log("*************************************************");
        console.log(JSON.stringify(updatedUser));
        console.log("*************************************************");
        callback(null, { updateStatus: "Success", updateAssignmentScore: updatedUser });
    }
    catch (error) {
        console.log(error)
        callback(error, null);
    }
}

exports.handle_request = handle_request;