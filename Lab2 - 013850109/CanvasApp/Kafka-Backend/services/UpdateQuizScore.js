var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    console.log('Inside Kafka Backend Update Quiz Score');
    console.log('Message: ', message);
    try {
        console.log("***********" + message.user.emailId + " >> " + message.params.course_uid + " >> " + message.body.name + " >> " + message.body.score + "***********************")

        var user = await Model.UserModel.findOne({ emailId: message.user.emailId });

        var i = 0;
        var j= 0;
        for (; i < user.course.length; i++) {
            console.log(user.course[i].course_uid + ":" + message.params.course_uid);
            if (String(user.course[i].course_uid) === String(message.params.course_uid)) {
                for (; j < user.course[i].coursework_submissions.length; j++) {
                    console.log(user.course[i].coursework_submissions[j].name + ":" + message.body.name);

                    if (String(user.course[i].coursework_submissions[j].name) === String(message.body.name)) {

                        console.log("quiz found!!" + j);
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

        var updatedUser = await Model.UserModel.update({ '_id': user._id, [submissionField]: message.body.name },
            { $set: { [submissionsScoreField]: message.body.score } })

        console.log("*************************************************");
        console.log(JSON.stringify(updatedUser));
        console.log("*************************************************");
        callback(null, { updateStatus: "Success", updateQuizScore: updatedUser });
    }
    catch (error) {
        console.log(error)
        callback(error, null);
    }
}

exports.handle_request = handle_request;