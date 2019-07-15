const faker = require('faker')
const User = require('../models/user-model')

populateFaker = () => {
  const users = []
  const userQty = 100

  for (let i = 0; i < userQty; i++) {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const newUser = { email, password }
    const user = new User(newUser)
    user.save()
  }
}

module.exports = populateFaker
