const jwt = require("jsonwebtoken");
const User = require('../api/v1/models/user')

const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorisation;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json("authentication invalid!");
  }
    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        req.user ={userId:  payload.userId,name:payload.name,email:payload.email}
    }catch(e){
        return res.status(401).json("You are not authenticated!");
    }
 
};


const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  // verifyTokenAndAdmin,
};