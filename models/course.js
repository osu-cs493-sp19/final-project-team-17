/*
 * Course schema
 */

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a review object.
 */
const CourseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructor: { required: true }
};
exports.CourseSchema = CourseSchema;

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM courses WHERE id = ?',
      [ id ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}
exports.getCourseById = getCourseById;

function getCourseByInstructorId(instructor) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM courses WHERE instructor = ?',
      [ instructor ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}
exports.getCourseByInstructorId = getCourseByInstructorId;

//need to fix
function getCourseByStudentId(sid) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT courseid FROM enrollment WHERE studentid = ?',
      [ sid ],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}
exports.getCourseByStudentId = getCourseByStudentId;

function getCourseCount() {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT COUNT(*) AS count FROM courses',
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count);
        }
      }
    );
  });
}

function getCoursesPage(page) {
  return new Promise(async (resolve, reject) => {
    /*
     * Compute last page number and make sure page is within allowed bounds.
     * Compute offset into collection.
     */
     const count = await getCourseCount();
     console.log(count);
     const pageSize = 10;
     const lastPage = Math.ceil(count / pageSize);
     page = page > lastPage ? lastPage : page;
     page = page < 1 ? 1 : page;
     const offset = (page - 1) * pageSize;

    mysqlPool.query(
      'SELECT * FROM courses ORDER BY id LIMIT ?,?',
      [ offset, pageSize ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            courses: results,
            page: page,
            totalPages: lastPage,
            pageSize: pageSize,
            count: count
          });
        }
      }
    );
  });
}
exports.getCoursesPage = getCoursesPage;


function insertNewCourse(course) {
  return new Promise((resolve, reject) => {
    course = extractValidFields(course, CourseSchema);
    course.id = null;
    mysqlPool.query(
      'INSERT INTO courses SET ?',
      course,
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
exports.insertNewCourse = insertNewCourse;

function getCourseByInstructorId(instructor) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT * FROM courses WHERE instructor = ?',
            [ instructor ],
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}
exports.getCourseByInstructorId = getCourseByInstructorId;


async function getCourseById(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM courses where id = ?',
      id,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          //console.log(projection);
          resolve(result[0]);
        }
      });
    });
  };
exports.getCourseById = getCourseById;

function updatecourseInfo(cid, upCourse){
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'UPDATE courses SET ? where id = ?',
      [upCourse, cid],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
}

exports.updatecourseInfo = updatecourseInfo;


function deleteCourse(cid){
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'DELETE FROM courses where id = ?',
      [cid],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
}

exports.deleteCourse = deleteCourse;

function deleteEnroll(cid){
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'DELETE FROM enrollment where courseid = ?',
      [cid],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
}

exports.deleteEnroll = deleteEnroll;

function getCourseOfInstructor(cid) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
            'SELECT instructor FROM courses WHERE id = ?',
            [ cid ],
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            }
        );
    });
}
exports.getCourseOfInstructor = getCourseOfInstructor;
