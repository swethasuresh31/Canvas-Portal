var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var canvasNode = require('../index');

var assert = require('chai').assert;
var expect = require('chai').expect;
var connection = require('../db/connection');
var agent = require('chai').request.agent(canvasNode);


describe('Canvas-Application', function () {

    it('POST /login', function () {
        //this.timeout(50000);

        agent.post('/login')
            .send({
                username: 'student1',
                password: 'student1'
            })
            .then(function (res) {
                assert.equal(res.status, 200);

            });
    });

    it('GET /UserCourse', function () {
        //this.timeout(50000);
        let user= 'student1';
        agent.get('/usercourse/'+user+'?role=student')
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });

    it('GET /SearchCourse', function () {
        //this.timeout(50000);
        agent.get('/searchcourse')
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });

    it('GET /Announcement', function () {
        //this.timeout(50000);
        let announcementUid= 1;
        agent.get('/announcement/id/'+announcementUid)
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });

    it('GET /Grades', function () {
        //this.timeout(50000);
        let user= 'student1';
        let courseUid = 1;
        agent.get('/grades/'+courseUid+'/'+user)
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });


})