const mysql = require('mysql');
const mysqlPool = require('../lib/mysqlPool');

const { extractValidFields } = require('../lib/validation');

const EnrollmentSchema = {
    add:{required: true},
    remove:{required: true}
};

const EnrollmentResultSchema = {
    id:{required:true},
    name:{required:true},
    email:{required:true}
}
exports.EnrollmentSchema = EnrollmentSchema;

async function getEnrollmentByCourseId(id) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT studentid FROM enrollment where courseid = ?',
            id,
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
};
exports.getEnrollmentByCourseId= getEnrollmentByCourseId;

async function addEnrollmentById(cid,sid) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'INSERT INTO enrollment (courseid, studentid) VALUES (?, ?)',
            [cid,sid],
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
};
exports.addEnrollmentById= addEnrollmentById;

async function removeEnrollmentById(cid,sid) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'DELETE FROM enrollment WHERE courseid = ? AND studentid = ?',
            [cid,sid],
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
};
exports.removeEnrollmentById= removeEnrollmentById;

async function getStudentInfoByCourseId(cid) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT * FROM users,enrollment WHERE enrollment.courseid = ? AND users.id = enrollment.studentid',
            cid,
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
};
exports.getStudentInfoByCourseId= getStudentInfoByCourseId;

exports.getProcessedStudentInfo = function(studentInfo){

    var csv = "ID,name,email\n";
    console.log(studentInfo);
    for(var i = 0;i<studentInfo.length;i++){
        studentInfo[i] = extractValidFields(studentInfo[i],EnrollmentResultSchema);
        csv += studentInfo[i].id + "," + studentInfo[i].name + "," + studentInfo[i].email + "\n";
    }
    return csv;
};
