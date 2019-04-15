var Model = require('../DatabaseConnection');
var mongooseTypes = require('mongoose').Types;

async function handle_request(message, callback) {
    console.log('Inside Kafka Backend Create Course');
    console.log('Message: ', message);


    try {
        var courseFind = await Model.CourseModel.findOne({course_id:message.body.courseId,course_term:message.body.courseTerm,course_dept_code:message.body.courseDeptCode});
        if(courseFind){
            callback(null,null);
        }

        var course = new Model.CourseModel({
            course_id: message.body.courseId,
            course_term: message.body.courseTerm,
            course_name: message.body.courseName,
            course_dept_code: message.body.courseDeptCode,
            course_dept: message.body.courseDept,
            course_desc: message.body.courseDesc,
            course_instructor: message.body.courseInstructor,
            course_room: message.body.courseRoom,
            course_capacity: message.body.courseCapacity,
            waitlist_capacity: message.body.waitlistCapacity,
            created_by: message.user.emailId,
            course_syllabus: message.body.courseSyllabus
        });

        var doc = await course.save();
        console.log("Course saved successfully.", doc);

        var user = await Model.UserModel.update({ _id: message.user._id }, {
            $push: {
                course: {
                    course_uid: doc._id,
                    course_id: message.body.courseId,
                    course_term: message.body.courseTerm,
                    course_name: message.body.courseName,
                    course_dept_code: message.body.courseDeptCode,
                    course_dept: message.body.courseDept,
                    course_capacity: message.body.courseCapacity,
                    waitlist_capacity: message.body.waitlistCapacity,
                    total_enrollment: doc.total_enrollment,
                    total_waitlist: doc.total_waitlist,
                }
            }
        })

        callback(null, user);

    } catch (err) {
        console.log("Unable to save course details.", err);
        callback(err, null);
    }
}


exports.handle_request = handle_request;