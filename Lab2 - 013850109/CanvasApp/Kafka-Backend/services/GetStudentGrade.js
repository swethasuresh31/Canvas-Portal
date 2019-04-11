var Model = require('../DatabaseConnection');

async function handle_request(message, callback){
    console.log('Inside Kafka Method Get Student Grade. Message ', message);
    
   await  Model.UserModel.findOne({'emailId': message.user.emailId}, async (err, user) => {
        if (err) {
            console.log("Unable to get the student grades.", err);
            callback(err, null);
        }
        else {
            var course = await user.course.find(course1 => String(course1.course_uid) === String(message.params.course_uid));
            console.log('Coursework Found kafka: ', JSON.stringify(course.coursework_submissions));
            callback(null, course.coursework_submissions);
        }
    });
}

exports.handle_request = handle_request;