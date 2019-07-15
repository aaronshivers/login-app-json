const Joi = require('@hapi/joi')

module.exports = userValidator = user => {
  const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)).{8,100}/

  const schema = ({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().regex(regex).required().error(() => {
      return `Password must contain 8-100 characters, with at least one 
      lowercase letter, one uppercase letter, one number, and one special character.`
    }),
    isAwesome: Joi.boolean()
  })

  return Joi.validate(user, schema)
}
