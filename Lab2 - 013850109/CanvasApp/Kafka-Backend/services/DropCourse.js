var Model = require('../DatabaseConnection');

async function handle_request(req, res) {
    console.log('Inside Kafka Method drop course. Message ', req);

    let courseUid = req.query.courseUid;
    let status = req.query.status

    try {
        //kickoff drop course flow
        console.log(req.query.user + " " + courseUid)
        var updatedUser = await Model.UserModel.update({ 'emailId': req.query.user }, { $pull: { course: { course_uid: courseUid } } })
        console.log("Updated User: " + JSON.stringify(updatedUser));
        if (updatedUser.nModified > 0) {
            var course = await Model.CourseModel.findById(courseUid)
            if (status === 'Waitlist') {
                console.log("Dropping waitlisted course")
                var updatedCourse = await Model.CourseModel.update({ '_id': courseUid }, {
                    $pull: { waitlisted: { emailId: req.query.user } },
                    $inc: { total_waitlist: -1 },
                })
                if (updatedCourse && updatedCourse.nModified === 1) {
                    var prof = await Model.UserModel.findOne({ 'emailId': course.created_by })
                    var i=0;
                    for (; i < prof.course.length; i++) if (prof.course[i].course_uid === course._id) break;
                    var courseField = 'course.' + i + '.total_waitlist'
                    await Model.UserModel.update({ 'emailId': course.created_by }, {
                       $inc : {[courseField] : -1}
                    })
                }
                res(null, { updateStatus: "Success", course: updatedCourse })
            } else {
                console.log("Dropping enrolled course")
                var updatedCourse = await Model.CourseModel.update({ '_id': courseUid }, {
                    $pull: { enrolled: { emailId: req.query.user } },
                    $inc: { total_enrollment: -1 },
                })
                if (updatedCourse && updatedCourse.nModified === 1) {
                    var prof = await Model.UserModel.findOne({ 'emailId': course.created_by })
                    var i=0;
                    for (; i < prof.course.length; i++) if (prof.course[i].course_uid === course._id) break;
                    var courseField = 'course.' + i + '.total_enrollment'
                    await Model.UserModel.update({ 'emailId': course.created_by }, {
                       $inc : {[courseField] : -1}
                    })
                }
                updateDropWaitist(courseUid, res)
            }
        }
    }
    catch (error) {
        console.log(error);
        res(error, null);
    }
}

updateDropWaitist = async (courseUid, res) => {
    console.log("----------------------------------------------------------------------------------")
    console.log("dropupdateWaitist")
    console.log("----------------------------------------------------------------------------------")
    try {
        var course = await Model.CourseModel.findById(courseUid)
        console.log("Drop - Enrolled : " + course.total_enrollment + " Waitlist: " + course.total_waitlist)
        if (course.total_enrollment < course.course_capacity && course.total_waitlist > 0) {
            var user = await Model.UserModel.findOne({ 'emailId': course.waitlisted[0].emailId })
            var updatedCourse = await Model.CourseModel.update({ '_id': course._id }, {
                $pull: { waitlisted: { emailId: user } },
                $push: { enrolled: { emailId: user, name: user.name, role: user.role } },
                $inc: { total_waitlist: -1, total_enrollment: 1 },
            })
            if (updatedCourse && updatedCourse.nModified === 1) {
                var prof = await Model.UserModel.findOne({ 'emailId': course.created_by })
                var i=0;
                for (; i < prof.course.length; i++) if (prof.course[i].course_uid === course._id) break;
                var courseWaitlistField = 'course.' + i + '.total_waitlist'
                var courseEnrollmentField = 'course.' + i + '.total_enrollment'
                await Model.UserModel.update({ 'emailId': course.created_by }, {
                   $inc : {[courseWaitlistField] : -1, [courseEnrollmentField] : 1},
                })

                await Model.UserModel.update({'_id' : user._id , 'course.course_uid' :  course._id}, {'course.$.isWaitlist': false})
            }
            
            res(null, { updateStatus: "Success", course: updatedCourse })
        }
        res(null, { updateStatus: "Success", course: course })
    }
    catch (error) {
        res(error, null);
    }
}


exports.handle_request = handle_request;