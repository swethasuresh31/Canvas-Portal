var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method course dashboard. Message ', message);
    
    Model.CourseModel.findById(message.params.course_uid, (err, course) => {
        if (err) {
            console.log("Unable to get the course details.", err);
            callback(err, null);
        }
        else {
            console.log('Course Details kafka: ', JSON.stringify(course));
            callback(null, course);
        }
    });
}

exports.handle_request = handle_request;