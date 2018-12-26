const express =  require('express')
const router = express.Router()

const User = require('../models/user-model')
const validatePassword = require('../middleware/validate-password')

router.get('/', (req, res) => {
  res.send('Login Application')
})

router.post('/users', (req, res) => {
  const { email, password } = req.body
  const user = new User({ email, password })

  if (validatePassword(password)) {
    user.save().then((user) => {
      res.status(201).send(user)
    }).catch(err => res.status(400).send(err.message))
  } else {
    res.status(400).send('Password must contain 8-100 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character.')
  }
})

module.exports = router
