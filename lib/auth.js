
const jwt = require('jsonwebtoken');

const secretKey = 'RandomString';

exports.generateAuthToken = function (userId,type) {
    const payload = {
        sub: userId,
        type: type
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
    return token;
};

exports.requireAuthentication = function (req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload.sub;
        req.usertype=payload.type;
        next();
    } catch (err) {
        console.error("  -- error:", err);
        res.status(401).send({
            error: "Invalid authentication token provided."
        });
    }
};

exports.requireAdmin = function (req,res,next){
  const authHeader = req.get('Authorization') || ' ';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1]: null;
  try{
    const payload = jwt.verify(token, secretKey);
    req.user = payload.sub;
    req.usertype=payload.type;
    next();
  }catch(err){
    console.log(" -- error: ", err);
    next();
  }
};
