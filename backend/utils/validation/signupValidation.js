const joi = require("joi");

const UserSchema = joi.object({
  first_name: joi.string().empty().min(2).max(30).required().messages({
    "string.empty": "First name must be require.",
    "string.min": "First name should have a minimum lenght 2",
    "any.required": "First name must be require",
  }),
  email: joi.string().empty().required().email().trim().messages({
    "string.empty": "email must be required",
    "any.required": " email must be required",
    "string.email": "invalid email address",
  }),
  password: joi.string().empty().min(6).required().trim().messages({
    "string.empty": "password must be required",
    "string.min": "password must be at least 6 charecters",
    "eny.required": "password must be required",
  }),
});

module.exports = UserSchema