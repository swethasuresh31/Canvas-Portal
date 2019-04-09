var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method Get Course Announcements. Message ', message);
    
    Model.CourseModel.findById(message.params.course_uid, (err, course) => {
        if (err) {
            console.log("Unable to get the course announcements.", err);
            callback(err, null);
        }
        else {
            console.log('Announcements kafka: ', JSON.stringify(course.announcements));
            callback(null, course);
        }
    });
}

exports.handle_request = handle_request;