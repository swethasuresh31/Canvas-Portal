const mongoose = require('mongoose');
const autoIncrement = require("mongodb-autoincrement");
mongoose.plugin(autoIncrement.mongoosePlugin);
const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/canvas-app', { useNewUrlParser: true });
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://dbuser:@ds235807.mlab.com:35807/canvas');


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
    }
})

UserSchema.index({ emailId: 1 }, { name: 'user_email_pkey', unique: true })


const CourseSchema = new Schema({
    course_id: {
        type: Number,
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
    },
    enrolled: {
        type: Array
    },
    waitlist_capacity: {
        type: Number,
        required: true,
    },
    total_waitlist: {
        type: Number,
        required: true,
    },
    waitlisted: {
        type: Array
    },
    course_dayandtime: {
        type: String
    },
    course_instructor: {
        type: String
    },
    created_by: {
        type: String
    },
    assignments: {
        type: Array
    },
    quizzes: {
        type: Array
    },
    announcements: {
        type: Array
    },
    enrolled
})

CourseSchema.index({ course_id: 1, course_term: 1, course_dept_code: 1 }, { name: 'course_pkey', unique: true })

const CourseModel = mongoose.model('user', CourseSchema);

module.exports = { UserModel, CourseModel };
