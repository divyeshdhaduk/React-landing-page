const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.json({message:"Not authenticated"});
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        err.statusCode = 401;
        throw err;
    }
    if (!decodedToken) {
        return res.json({message:"Not authenticated"});
    }
    req.user = decodedToken;
    next();
};