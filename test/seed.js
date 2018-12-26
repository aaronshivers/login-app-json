const User = require('../models/user-model')

const users = [{
  email: 'user0@example.com', // always saved to database
  password: 'Pass1234!' 
}, {
  email: 'user1@example.com', // always saved to database
  password: 'Pass1234!' 
}, {
  email: 'user2@example.com', // used for testing duplicate entries
  password: 'Pass1234!' 
}, {
  email: 'user3.example.com', // invalid email
  password: 'Pass1234!' 
}, {
  email: 'user4@example.com',
  password: 'pass1234' // invalid password
}]

const populateUsers = (done) => {
  User.deleteMany().then(() => {
    const user0 = new User(users[0]).save()
    const user1 = new User(users[1]).save()

    return Promise.all([user0, user1])
  }).then(() => done())
}


module.exports = {
  users,
  populateUsers
}