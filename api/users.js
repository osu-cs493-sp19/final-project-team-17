const router = require('express').Router();

// const { getBusinessesByOwnerId } = require('../models/user');
// const { getReviewsByUserId } = require('../models/review');
// const { getPhotosByUserId } = require('../models/photo');
const {insertNewUser, getUserById, validateUser, getUserByEmail, getRoleByemail, getUser, getUserDetailsById, UserSchema} = require('../models/user')
//
const { generateAuthToken, requireAuthentication,requireAdmin  } = require('../lib/auth')
const { validateAgainstSchema } = require('../lib/validation');

/*
 Post a new user
*/

router.post('/',requireAdmin,async(req,res,next) => {
  if(validateAgainstSchema(req.body,UserSchema)){
    try{
    // console.log("body admin: ", req.body.admin);
      if(req.body.role == 'student'){
        const id = await insertNewUser(req.body);
        res.status(201).send(
          {
            _id: id
          }
        );
      }
      else if(req.body.role == 'admin'  || req.body.role == 'instructor'){
        const userAdmin = await getUserById(req.user);
        if(!userAdmin || userAdmin.role != 'admin'){
          res.status(401).send({
            error: "Invalid authentication token provided, only admin user can create another admin or instructor"
          });
        }
        else{
        const id = await insertNewUser(req.body);
        console.log("id is---------------------: ", id);
        res.status(201).send(
          {
            _id: id
          }
        );}
      }
    }catch(err){
      console.error(" -- ERROR:", err);
      res.status(500).send({
        error: "Error insert new user, try again later."
      })
    }
  }
  else{
    res.status(400).send({
      error: "Request body is not a valid user object."
    });
  }
});

router.get('/:id',requireAuthentication, async(req, res, next) => {
  console.log("req user is: ", req.user);
  const userid = await getUserById(req.user);
  console.log("user id is: ", userid);
  const userRole = await getUserById(req.user);
  if(req.params.id  == userid.id || (userRole && userRole.role == 'admin')) {
      try{
        const user = await getUserDetailsById(parseInt(req.params.id));
        if (user) {
          res.status(200).send(user);
        } else{
            next();
          }
      } catch (err){
          console.log("ERROR: ", err);
          res.status(500).send({
            error: "Unable to fetch user."
          });
      }
  } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
  }
});

router.get('/',async(req, res, next) => {
  try{
    const users = await getUser()
    if(users){
      res.status(200).send(user);
    }else{
      res.status(404).send({
        error: "No user."
      });
    }
  }
  catch(err){
    console.log("get user error is: ", err);
    res.status(500).send({
      error: "Unable to fetch user."
    });
  }
});

/*
 User login
*/

router.post('/login', async(req,res) => {
    if (req.body && req.body.email && req.body.password) {
      try {
        const authenticated = await validateUser(req.body.email, req.body.password);
        const user=await getUserByEmail(req.body.email);
        if (authenticated) {
          const token = generateAuthToken(user.id,user.role);
          console.log(user.id);
          res.status(200).send({
            token: token
          });
        } else {
          res.status(401).send({
            error: "Invalid credentials"
          });
        }
      } catch (err) {
        res.status(500).send({
          error: "Error validating user.  Try again later."
        });
      }
  } else {
    res.status(400).send({
      error: "Request body was invalid"
    });
  }
});

module.exports = router;
