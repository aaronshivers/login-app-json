const jwt = require('jsonwebtoken')

module.exports = async ({ _id, isAdmin, isAwesome }) => {

  try {
    
    const payload = { _id, isAdmin, isAwesome }
    const secret = process.env.JWT_SECRET
    
    return await jwt.sign(payload, secret)

  } catch (error) {

    return error.message
  }
}
