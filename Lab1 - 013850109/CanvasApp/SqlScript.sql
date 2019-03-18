DROP database canvas;
CREATE DATABASE canvas;

use canvas;

drop table announcements;
drop table submission;
drop table student_coursework;
drop table coursework;
drop table student_courses;
drop table permission_code;
drop table course;
DROP TABLE user;

CREATE TABLE user (
    email_id varchar(255) UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    is_student boolean DEFAULT TRUE,
    profile_image varchar(255),
    phone_number varchar(20),
    about_me varchar(600),
    city varchar(100),
    country varchar(100),
    company varchar(255),
    school varchar(255),
    hometown varchar(255),
    languages varchar(300),
    gender varchar(50),
    PRIMARY KEY(email_id)
);

CREATE TABLE course (
    course_uid int UNIQUE NOT NULL AUTO_INCREMENT,
    course_id varchar(50) NOT NULL,
    course_term varchar(100) NOT NULL,
    course_name varchar(150) NOT NULL, 
    course_dept varchar(150) NOT NULL,
    course_dept_code varchar(150) NOT NULL,
    course_desc varchar(255), 
    course_room varchar(255), 
    course_capacity int NOT NULL,
    total_enrollment int default 0,
    total_waitlist int default 0,
    course_dayandtime varchar(255),
    course_instructor varchar(255),
    waitlist_capacity int,  
    created_by varchar(255) NOT NULL,
    PRIMARY KEY(course_uid),
    CONSTRAINT FK_UserCourse FOREIGN KEY (created_by)
    REFERENCES user(email_id)
);

CREATE TABLE permission_code (
	course_uid int NOT NULL,
	permission_code varchar(255) unique,
    isUsed boolean DEFAULT FALSE,
    CONSTRAINT FK_CoursePermissionCode FOREIGN KEY (course_uid)
    REFERENCES course(course_uid)
);

CREATE TABLE student_courses (
    studentcourses_uid int unique not null AUTO_INCREMENT,
    course_uid int NOT NULL,
    email_id varchar(255) NOT NULL,
    isWaitlist boolean,
	PRIMARY KEY (studentcourses_uid),
	UNIQUE KEY (course_uid, email_id),
    CONSTRAINT FK_CourseStudent FOREIGN KEY (course_uid)
    REFERENCES course(course_uid),
    CONSTRAINT FK_UserStudent FOREIGN KEY (email_id)
    REFERENCES user(email_id)
);


CREATE TABLE coursework (
    coursework_uid int UNIQUE NOT NULL AUTO_INCREMENT,
    coursework_name varchar(255) NOT NULL,
    course_uid int NOT NULL,
    due_date TIMESTAMP,
    total_points int,
    instructions varchar(1000),
    coursework_type varchar(255),
    PRIMARY KEY(coursework_uid),
	CONSTRAINT FK_Coursework FOREIGN KEY (course_uid)
    REFERENCES course(course_uid )
);

CREATE TABLE student_coursework (
	student_coursework_uid int UNIQUE NOT NULL AUTO_INCREMENT,
	studentcourses_uid INT NOT NULL,
    coursework_uid int NOT NULL, 
    email_id varchar(255) NOT NULL,
    scored_points int,
	PRIMARY KEY(student_coursework_uid),
	UNIQUE KEY (studentcourses_uid, coursework_uid),
	CONSTRAINT FK_StudentCoursework FOREIGN KEY (coursework_uid)
    REFERENCES coursework(coursework_uid),
    CONSTRAINT FK_StudentCoursework1 FOREIGN KEY (studentcourses_uid)
    REFERENCES student_courses(studentcourses_uid),
    CONSTRAINT FK_UserCoursework FOREIGN KEY (email_id)
    REFERENCES user(email_id)
);

ALTER TABLE student_coursework
DROP FOREIGN KEY FK_StudentCoursework1;

ALTER TABLE student_coursework
ADD FOREIGN KEY FK_StudentCoursework1 (studentcourses_uid)
REFERENCES student_courses(studentcourses_uid)
ON DELETE CASCADE;

CREATE TABLE announcements (
	announcement_uid int UNIQUE NOT NULL AUTO_INCREMENT,
	course_uid int NOT NULL,
    header varchar(255),
    body varchar(255),
    announcement_TS TIMESTAMP,
    PRIMARY KEY(announcement_uid),
    CONSTRAINT FK_CourseAnnouncements FOREIGN KEY (course_uid)
    REFERENCES course(course_uid)
);

CREATE TABLE quiz_questions (
coursework_uid int NOT NULL,
question_number int NOT NULL,
question varchar(1000) NOT NULL,
first_option varchar(255) NOT NULL,
second_option varchar(255) NOT NULL,
third_option varchar(255) NOT NULL,
fourth_option varchar(255) NOT NULL,
answer varchar(255) NOT NULL,
PRIMARY KEY(coursework_uid, question_number),
CONSTRAINT FK_QuizQuestions FOREIGN KEY (coursework_uid)
REFERENCES coursework(coursework_uid)
);


select * from permission_code;

insert into course(course_id,course_term,course_name,course_dept,course_dept_code, course_desc,course_room,course_capacity,total_enrollment,total_waitlist,waitlist_capacity,created_by,course_instructor,course_dayandtime)
 values('275','Spring 2019','Ent Dist Systems test','computer engineering','CMPE','Enterprise Distributed Systems','Engineering Building 189',5,0,0,3,'faculty1','faculty 1','Monday 3.45-5.45');

insert into course(course_id,course_term,course_name,course_dept,course_dept_code, course_desc,course_room,course_capacity,total_enrollment,total_waitlist,waitlist_capacity,created_by,course_instructor,course_dayandtime)
 values('272','Spring 2019','Ent SW Platforms','computer engineering','CMPE','Enterprise Software Platforms','Engineering Building 337',5,0,0,3,'faculty1','faculty 1','Tuesday 3.45-5.45');

insert into course(course_id,course_term,course_name,course_dept,course_dept_code, course_desc,course_room,course_capacity,total_enrollment,total_waitlist,waitlist_capacity,created_by,course_instructor,course_dayandtime)
 values('273','Fall 2018','Ent Dist Systems','computer engineering','CMPE','Enterprise Distributed Systems','Engineering Building 189',5,0,0,3,'faculty1','faculty 1','Wednesday 3.45-5.45');

insert into student_courses(course_uid,email_id,isWaitlist) values (1,'student1',0);
insert into student_courses(course_uid,email_id,isWaitlist) values (2,'student1',0);
