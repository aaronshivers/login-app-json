const expect = require('expect')
const request = require('supertest')

const app = require('./../app')
const { users, populateUsers } = require('./seed')

beforeEach(populateUsers)

// GET /
describe('/GET /', () => {
  it('should respond with 200', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done)
  })
})

// POST /users
describe('/POST /users', () => {
  it('should create a new user', (done) => {
    const { email, password } = users[2]
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toBe(email)
        expect(res.body.password).toBe(password)
      })
      .end(done)
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
