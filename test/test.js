const expect = require('expect')
const request = require('supertest')

const app = require('./../app')
const User = require('../models/user-model')
const { users, populateUsers } = require('./seed')

beforeEach(populateUsers)

// GET /
describe('GET /', () => {
  it('should respond with 200', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done)
  })
})

// POST /users
describe('POST /users', () => {
  it('should create a new user', (done) => {
    const { email, password } = users[2]
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(201)
      .expect((res) => {
        expect(res.body._id).toBeTruthy()
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy()
          expect(user.email).toBe(email)
          expect(user.password).not.toBe(password)
          done()
        }).catch(err => done(err))
      })
  })

  it('should NOT create a duplicate user', (done) => {
    const { email, password } = users[0]
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done)
  })

  it('should NOT create a user with an invalid email', (done) => {
    const { email, password } = users[3]
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done)
  })

  it('should NOT create a user with an invalid password', (done) => {
    const { email, password } = users[4]
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done)
  })
})

describe('GET /', () => {
  it('should get all users', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2)
      })
      .end(done)
  })
})

