const jwt = require('jsonwebtoken')

const createToken = (user) => {
  const payload = { _id: user._id }
  const secret = process.env.JWT_SECRET
  const options = { expiresIn: '1d' }
  // return token = jwt.sign(payload, secret, options)

  // return new Promise((resolve, reject) => {
    // return jwt.sign(payload, secret, options, (err, token) => {
    //   if (err) {
    //     reject(err)
    //   } else {
    //     console.log(token)
    //     return token
    //   }
    // })
  // })
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err)

      return resolve(token)
    })
  })
}

module.exports = createToken
