CREATE DATABASE canvas;

use canvas;

CREATE TABLE user (
    email_id varchar(255) UNIQUE NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
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
    course_syllabus varchar(255),
    waitlist_capacity int,  
    created_by varchar(255) NOT NULL,
    PRIMARY KEY(course_uid),
    CONSTRAINT FK_UserCourse FOREIGN KEY (created_by)
    REFERENCES user(email_id)
);

CREATE TABLE student_courses (
    studentcourses_uid int unique not null AUTO_INCREMENT,
    course_uid int NOT NULL,
    email_id varchar(255) NOT NULL,
    is_waitlist boolean,
	PRIMARY KEY (studentcourses_uid),
	UNIQUE KEY (course_uid, email_id),
    CONSTRAINT FK_CourseStudent FOREIGN KEY (course_uid)
    REFERENCES course(course_uid),
    CONSTRAINT FK_UserStudent FOREIGN KEY (email_id)
    REFERENCES user(email_id)
);


INSERT INTO student_courses(course_uid, email_id,is_waitlist) VALUES (1,"swetha.suresh@sjsu.edu",false);
INSERT INTO student_courses(course_uid, email_id,is_waitlist) VALUES (2,"swetha.suresh@sjsu.edu",false);
INSERT INTO student_courses(course_uid, email_id,is_waitlist) VALUES (1,"sample.student@sjsu.edu",false);
INSERT INTO student_courses(course_uid, email_id,is_waitlist) VALUES (2,"sample.student@sjsu.edu",false);
