const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// mongoose.connect('mongodb://127.0.0.1:27017/canvas-app', { useNewUrlParser: true});
mongoose.connect('mongodb+srv://dbuser:dbuserpwd@canvas-app-tbdky.mongodb.net/canvas-app?retryWrites=true');
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://dbuser:@ds235807.mlab.com:35807/canvas');


const userListSchema = new Schema({
    emailId: {
        type: String,
        sparse: true,
    },
    name: {
        type: String
    }
});

const CourseSchema = new Schema({
    course_id: {
        type: String,
        required: true,
    },
    course_term: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_dept: {
        type: String,
        required: true
    },
    course_dept_code: {
        type: String,
        required: true
    },
    course_desc: {
        type: String
    },
    course_room: {
        type: String
    },
    course_capacity: {
        type: Number,
        required: true,
    },
    total_enrollment: {
        type: Number,
        required: true,
        default: 0
    },
    enrolled: {
        type: [userListSchema],
        default: [],
    },
    waitlist_capacity: {
        type: Number,
        required: true,
    },
    total_waitlist: {
        type: Number,
        required: true,
        default: 0
    },
    waitlisted: {
        type: [userListSchema],
        default: [],
    },
    course_dayandtime: {
        type: String
    },
    course_instructor: {
        type: String
    },
    course_syllabus: {
        type: String
    },
    created_by: {
        type: String
    },
})

CourseSchema.index({ course_id: 1, course_term: 1, course_dept_code: 1 }, { name: 'course_pkey', unique: true })

const CourseModel = mongoose.model('course', CourseSchema);

const userCourseSchema = new Schema({
    course_uid: {
        type: Number,
        required: true
    },
    course_id: {
        type: String,
        required: true,
    },
    course_term: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_dept: {
        type: String,
        required: true
    },
    course_dept_code: {
        type: String,
        required: true
    },
    isWaitlist:
    {
        type: Boolean,
        required: true,
        default: false
    },
    course_capacity: {
        type: Number
    },
    total_enrollment: {
        type: Number
    },
    waitlist_capacity: {
        type: Number
    },
    total_waitlist: {
        type: Number
    },
})

const userCourseModel = mongoose.model('usercourse', userCourseSchema);

const UserSchema = new Schema({
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String, enum: ['student', 'faculty'],
        required: true
    },
    phoneNo: {
        type: String
    },
    aboutMe: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    company: {
        type: String
    },
    school: {
        type: String
    },
    hometown: {
        type: String
    },
    languages: {
        type: String
    },
    gender: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String
    },
    course: {
        type: [userCourseSchema],
        default: [],
    },

})

UserSchema.index({ emailId: 1 }, { name: 'user_email_pkey', unique: true })

const UserModel = mongoose.model('user', UserSchema);

module.exports = { UserModel, CourseModel, userCourseModel };
