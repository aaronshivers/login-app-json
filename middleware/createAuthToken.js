const jwt = require('jsonwebtoken')

module.exports = ({ _id, isAdmin, isAwesome }) => {
  const payload = { _id, isAdmin, isAwesome }
  const secret = process.env.JWT_SECRET

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (err, token) => {
      if (err) return reject(err)

      return resolve(token)
    })
  })
}
