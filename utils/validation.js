
var Joi = require("@hapi/joi")

//validation
function registerValidation(data){

   const schema = Joi.object({
      username: Joi.string().min(4).required(),
      email: Joi.string().required().email(),
      password: Joi.string().min(4).required()
   })
   try{
      return schema.validate(data)
   }
   catch(err){
      return err
   }
}


function loginValidation(data){

   const schema = Joi.object({
      email: Joi.string().min(4).required().email(),
      password: Joi.string().min(4).required()
   })
   try{
      return schema.validate(data)
   }
   catch(err){
      return err
   }
}


module.exports = {
  registerValidation,
  loginValidation
}
