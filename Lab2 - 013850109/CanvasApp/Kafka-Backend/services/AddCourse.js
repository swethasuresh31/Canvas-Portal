var Model = require('../DatabaseConnection');

async function handle_request(req, res) {
    console.log('Inside Kafka Method add course. Message ', req);

    let courseUid = req.body.courseUid;
    let permissionNumber = req.body.permissionNumber;

    try {
        //kickoff add course flow
        console.log(req.user.emailId + " " + courseUid + " " + permissionNumber)
        var course = await Model.CourseModel.findById(courseUid)
        var user = await Model.UserModel.findById(req.user._id)
        console.log("checkStudentAlreadyEnrolled")
        for (var i=0; i < user.course.length; i++) {
            if (user.course[i].course_uid === course._id &&
                (user.course[i].isWaitlist === false || permissionNumber === 'undefined' || permissionNumber === '')) {
                    throw "course already enrolled"
            }
        }

        console.log(course)
        console.log(user)
        if (permissionNumber === 'undefined' || permissionNumber === '') {
            checkAvailability(user, course, permissionNumber, res)
        }
        else {
            checkPermissionNumber(user, course, permissionNumber, res)
        }
    }
    catch (error) {
        console.log(error);
        res(error, null);
    }
}

checkPermissionNumber = async (user, course, permissionNumber, res) => {
    console.log("checkPermissionNumber: " + permissionNumber)
    try {
        var resultset = await Model.CourseModel.update({ '_id': course._id, 'permissionCodes.permissionCode': permissionNumber }, { $set: { 'permissionCodes.$.isUsed': true } })
        console.log(resultset)
        if (resultset.nModified > 0) {
            checkStudentAlreadyWailisted(user, course, res)
        } else {
            checkAvailability(user, course, permissionNumber, res)
        }
    }
    catch (error) {
        res(error, null);
    }
}

checkAvailability = async (user, course, permissionNumber, res) => {
    console.log("Checking availability")
    if (course.total_enrollment < course.course_capacity) {
        updateEnrollment(user, course, res)
    } else if (course.total_waitlist < course.waitlist_capacity) {
        updateWaitist(user, course, res)
    } else {
        res(null, { updateStatus: "Forbidden" })
    }
}

//only for valid permission code
checkStudentAlreadyWailisted = async (user, course, res) => {
    console.log("checkStudentAlreadyWailisted")
    var i = 0
    var exists = false
    for (; i < user.course.length; i++) {
        if (user.course[i].course_uid === course._id &&
            user.course[i].isWaitlist === true) {
            exists = true; break;
        }
    }

    if (exists) {
        waitlistField = 'course.' + i + '.isWaitlist'
        try {
            var updatedUser = await Model.UserModel.update({ '_id': user._id }, { $set: { [waitlistField]: false } })
            var updateResult = await Model.CourseModel.update({ '_id': course._id }, {
                $pull: { waitlisted: { emailId: user.emailId } },
                $push: { enrolled: { emailId: user.emailId, name: user.name, role: user.role } },
                $inc: { total_waitlist: -1, total_enrollment: 1 },
            })
            if (updateResult && updateResult.nModified === 1) {
                var prof = await Model.UserModel.findOne({ 'emailId': course.created_by })
                var i = 0;
                for (; i < prof.course.length; i++) if (prof.course[i].course_uid === course._id) break;
                var courseWaitlistField = 'course.' + i + '.total_waitlist'
                var courseEnrollmentField = 'course.' + i + '.total_enrollment'
                await Model.UserModel.update({ 'emailId': course.created_by }, {
                    $inc: { [courseWaitlistField]: -1, [courseEnrollmentField]: 1 },
                })
            }
            res(null, { updateStatus: "Success", user: updatedUser })
        }
        catch (error) {
            res(error, null);
        }
    } else {
        updateEnrollment(user, course, res)
    }
}

updateWaitist = async (user, course, res) => {
    // console.log("updateWaitist")

    try {
        console.log("------------------------------------------------------------")
        console.log("updating")
        console.log("------------------------------------------------------------")
        var updateResult = await Model.CourseModel.update({ '_id': course._id, 'waitlisted.emailId': { $ne: user.emailId } }, {
            $push: { waitlisted: { emailId: user.emailId, name: user.name, role: user.role } },
            $inc: { total_waitlist: 1 },
        })
        console.log("------------------------------------------------------------")
        console.log(updateResult)
        console.log("------------------------------------------------------------")
        if (updateResult && updateResult.nModified === 1) {
            var prof = await Model.UserModel.findOne({ 'emailId': course.created_by })
            var i = 0;
            for (; i < prof.course.length; i++) if (prof.course[i].course_uid === course._id) break;
            var courseField = 'course.' + i + '.total_waitlist'
            await Model.UserModel.update({ 'emailId': course.created_by }, {
                $inc: { [courseField]: 1 }
            })
        }
        insertStudentCourse(user, course, true, res)
    }
    catch (error) {
        console.log(error)
        res(error, null);
    }
}

updateEnrollment = async (user, course, res) => {
    console.log("updateEnrollment")
    console.log(course._id)
    console.log(user.emailId)
    try {
        var updateResult = await Model.CourseModel.update({ '_id': course._id, 'enrolled.emailId': { $ne: user.emailId } }, {
            $push: { enrolled: { emailId: user.emailId, name: user.name, role: user.role } },
            $inc: { total_enrollment: 1 },
        })
        if (updateResult && updateResult.nModified === 1) {
            var prof = await Model.UserModel.findOne({ 'emailId': course.created_by })
            var i = 0;
            for (; i < prof.course.length; i++) if (prof.course[i].course_uid === course._id) break;
            var courseField = 'course.' + i + '.total_enrollment'
            await Model.UserModel.update({ 'emailId': course.created_by }, {
                $inc: { [courseField]: 1 }
            })
        }
        insertStudentCourse(user, course, false, res)
    }
    catch (error) {
        console.log(error)
        res(error, null);
    }
}

insertStudentCourse = async (user, course, isWaitlist, res) => {
    console.log("insertStudentCourse")

    try {
        var updatedUser = await Model.UserModel.update({ _id: user._id, 'course.course_uid': { $ne: course._id } }, {
            $push: {
                course: {
                    course_uid: course._id,
                    course_id: course.course_id,
                    course_term: course.course_term,
                    course_name: course.course_name,
                    course_dept_code: course.course_dept_code,
                    course_dept: course.course_dept,
                    isWaitlist: isWaitlist,
                    coursework_submissions: []
                }
            }
        })

        if (!isWaitlist && updatedUser.nModified > 0) {
            console.log("---------------------------------------------------------------------------------------------")
            for (var i = 0; i < course.assignments.length; i++) {

                var updatedUser = await Model.UserModel.update({ _id: user._id, 'course.course_uid': course._id }, {
                    $push: {
                        'course.$.coursework_submissions':
                        {
                            name: course.assignments[i].name,
                            due_date: course.assignments[i].due_date,
                            total_points: course.assignments[i].total_points,
                        }
                    },
                })
            }
            for (var i = 0; i < course.quizzes.length; i++) {

                var updatedUser = await Model.UserModel.update({ _id: user._id, 'course.course_uid': course._id }, {
                    $push: {
                        'course.$.coursework_submissions':
                        {
                            name: course.quizzes[i].name,
                            due_date: course.quizzes[i].due_date,
                            total_points: course.quizzes[i].total_points,
                        }
                    },
                })
            }

        }
        res(null, { updateStatus: "Success", user: updatedUser })
    }
    catch (error) {
        res(error, null);
    }
}

exports.handle_request = handle_request;