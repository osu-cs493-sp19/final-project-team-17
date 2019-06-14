const multer = require('multer');
const crypto = require('crypto');
const {requireAuthentication}=require('../lib/auth');
const mysqlPool = require('../lib/mysqlPool');

const fs = require('fs');
const { ObjectId, GridFSBucket } = require('mongodb');
const { getDBReference } = require('../lib/mongo');

const AssignmentsSchema = {
    courseid: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true }
};


exports.getDownloadStreamByFilename = function (filename) {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, { bucketName: 'submissions' });
    return bucket.openDownloadStreamByName(filename);
};

function getAssignmentsById(id) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT * FROM assignments WHERE id = ?',
            [ id ],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            }
        );
    });
}
exports.getAssignmentsById=getAssignmentsById;
function getCourseByid(id) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT * FROM courses WHERE id = ?',
            [ id ],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            }
        );
    });
}
exports.getCourseByid=getCourseByid;

function PushTheFileInFS(File) {
    return new Promise((resolve, reject) => {
        const db = getDBReference();
        const bucket = new GridFSBucket(db, {bucketName: 'submissions'});

        const metadata = {
            contentType: File.contentType
        };

        const uploadStream = bucket.openUploadStream(
            File.filename,
            {metadata: metadata}
        );

        fs.createReadStream(File.path)
            .pipe(uploadStream)
            .on('error', (err) => {
                reject(err);
            })
            .on('finish', (result) => {
                resolve(result._id);
            });
    });
}
exports.PushTheFileInFs=PushTheFileInFS;

function insertNewAssignments(assignment) {
    return new Promise((resolve, reject) => {

        assignment.id = null;
        mysqlPool.query(
            'INSERT INTO assignments SET ?',
            assignment,
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            }
        );
    });
}
exports.insertNewAssignments=insertNewAssignments;


function insertNewSumbit(submit) {
    return new Promise((resolve, reject) => {
        //submit = extractValidFields(sumbit, AssignmentsSchema);

        submit.id = null;
        mysqlPool.query(
            'INSERT INTO submissions SET ?',
            submit,
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            }
        );
    });
}
exports.insertNewSumbit=insertNewSumbit;

function getSumbitByAsgid(id) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT * FROM submissions WHERE assignmentid = ?',
            [ id ],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
exports.getSumbitByAsgid=getSumbitByAsgid;

function deleteAssignmentByid(id) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'DELETE FROM assignments WHERE id = ?',
            [ id ],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows > 0);
                }
            }
        );
    });
}
exports.deleteAssignmentByid=deleteAssignmentByid;

function updateAssignment(assignment,id) {
    return new Promise((resolve, reject) => {

        mysqlPool.query(
            'UPDATE assignments SET ? WHERE id = ?',
            [ assignment, id ],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows > 0);
                }
            }
        );
    });
}
exports.updateAssignment=updateAssignment;

function getAssignmentsByCourseId(cid) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT id FROM assignments WHERE courseid = ?',
            [ cid ],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
exports.getAssignmentsByCourseId=getAssignmentsByCourseId;