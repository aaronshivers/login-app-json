const express =  require('express')
const router = express.Router()

const User = require('../models/user-model')

router.get('/', (req, res) => {
  res.send('Login Application')
})

router.post('/users', (req, res) => {
  const { email, password } = req.body
  const user = new User({ email, password })

  user.save().then((user) => res.send(user))
})

module.exports = router
