const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req,res,next)=>{
    let token;
    
    let authHeader = req.headers.Authorization || req.headers.authorization;
 if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }

      req.user = decoded.user; // Save decoded user info for later use
      next();
    });
    if(!token){
        res.status(401);
    }
  } else {
    res.status(401);
    throw new Error("Authorization token is missing or invalid");
  }
});

module.exports =validateToken;