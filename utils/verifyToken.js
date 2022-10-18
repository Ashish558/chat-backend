
const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {

   res.header('Access-Control-Allow-Origin', process.env.FRONT_ORIGIN);
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
   res.header('Access-Control-Allow-Credentials', true);

   var token = req.header("Authorization")

   if (!token) return res.status(400).json("Access denied , no token")

   try {
      const verified = await jwt.verify(token, process.env.SECRET)
      req.user = verified
      next()
   } catch (err) {
      console.log("server error :")
      return res.status(400).json(err)
   }

}