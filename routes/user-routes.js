const express =  require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user-model')
const validatePassword = require('../middleware/validate-password')
const createToken = require('../middleware/create-token')
const authenticateUser = require('../middleware/authenticate-user')

const cookieExpiration = { expires: new Date(Date.now() + 86400000) }

// GET /
router.get('/', (req, res) => {
  res.send('Login Application')
})

// POST /users
router.post('/users', (req, res) => {
  const { email, password } = req.body
  const user = new User({ email, password })

  if (validatePassword(password)) {
    user.save().then((user) => {
      createToken(user).then((token) => {
        res.cookie('token', token, cookieExpiration).status(201).send(user)
      }).catch(err => res.status(500).send(err.message))
    }).catch(err => res.status(400).send(err.message))
  } else {
    res.status(400).send('Password must contain 8-100 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character.')
  }
})

// GET /users
router.get('/users', (req, res) => {
  User.find().then((users) => {
    if (users.length === 0) {
      res.status(404).send('Sorry, the database must be empty.')
    } else {
      res.send(users)
    }
  })
})

// GET /users/:id
router.get('/users/:id', (req, res) => {
  const { id } = req.params

  User.findById(id).then((user) => {
    if (user) {
      res.send(user)
    } else {
      res.status(404).send('Sorry, that user id is not in our database.')
    }
  })
})

// DELETE /users/:id
router.delete('/users/:id', (req, res) => {
  const { id } = req.params

  User.findByIdAndDelete(id).then((user) => {
    if (user) {
      res.send(user)
    } else {
      res.status(404).send('Sorry, that user Id was not found in our database.')
    }
  })
})

// PATCH /users/:id
router.patch('/users/:id', (req, res) => {
  const { id } = req.params
  const { email, password } = req.body
  const options = { new: true, runValidators: true }
  const saltRounds = 10
  
  if (validatePassword(password)) {
    bcrypt.hash(password, saltRounds).then((hash) => {
      User.findByIdAndUpdate(id, { email, password: hash }, options).then((user) => {
        if (user) {
          res.status(201).send(user)
        } else {
          res.status(404).send('Sorry, that user Id was not found in our database.')
        }
      }).catch(err => res.status(400).send(err.message))
    })
  } else {
    res.status(400).send('Password must contain 8-100 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character.')
  }
})

// GET /profile
router.get('/profile', (req, res) => {
  res.send('You are logged in.')
})

module.exports = router
