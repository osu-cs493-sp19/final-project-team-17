/*
 * User schema and data accessor methods.
 */

const mysql = require('mysql');
const mysqlPool = require('../lib/mysqlPool');
const bcrypt = require('bcryptjs');

const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mysqlPool');
const { generateAuthToken, requireAuthentication } = require('../lib/auth')

const { getCourseByInstructorId, getCourseByStudentId } = require('./course');

/*
 * Schema for a User.
 */
const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: { required: true}
};
exports.UserSchema = UserSchema;



/*
 * Fetch a user from the DB based on user ID.
 */
async function getUserById(id, includePassword) {
  const projection = includePassword ? {} : { password: 0 };
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT id, name,email, role FROM users where id = ?',
      id,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          console.log(projection);
          resolve(result[0]);
        }
      });
    });
  };
exports.getUserById = getUserById;

async function getUser() {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT id, name,email, role FROM users',
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
exports.getUser = getUser;


async function getUserDetailsById(id, includePassword) {
  /*
   * Execute three sequential queries to get all of the info about the
   * specified User, including its course
   */
  const user = await getUserById(id, includePassword);
  console.log("the user's role is: ", user.role, "user is: ", user);
  if (user.role == 'instructor') {
    teach_courses = await getCourseByInstructorId(user.id);
    console.log("teach course: ", teach_courses);
    var result = {...user, coursesTeach: teach_courses};
    return result
  }
  else if(user.role == 'student') {
    student_course = await getCourseByStudentId(id);
    var result = {...user, TakenCourses: student_course};
    return result
  }
  return user;
};
exports.getUserDetailsById = getUserDetailsById;

function getUserByEmail(email){
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM users where email = ?',
      [email],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
};

exports.getUserByEmail = getUserByEmail;

function getRoleByemail(email) {
  return new Promise((resolve, reject) => {
      mysqlPool.query(
        'SELECT role FROM users WHERE email = ?' ,
        [ email ],
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
exports.getRoleByemail = getRoleByemail;

exports.validateUser = async function (email, password) {
  const user = await getUserByEmail(email);
  console.log(user);
  const authenticated = user && await bcrypt.compare(password, user.password);
  return authenticated;
};

/*
 * Insert a new User into the DB.
 */
exports.insertNewUser = async function (user) {
  const userToInsert = extractValidFields(user, UserSchema);

  const passwordHash = await bcrypt.hash(userToInsert.password, 8);
  userToInsert.password = passwordHash;
  return new Promise((resolve, reject) => {
  mysqlPool.query(
    'INSERT INTO users SET ?',
    userToInsert,
    function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};
