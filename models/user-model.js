const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const saltingRounds = 10

const hashPassword = require('../middleware/hash-password')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 8,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 100
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  isAwesome: {
    type: Boolean,
    default: true
  }
})

hashPassword(userSchema)

const User = mongoose.model('User', userSchema)

module.exports = User
