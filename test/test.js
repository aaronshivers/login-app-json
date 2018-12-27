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
        } else {
          User.findOne({email}).then((user) => {
            expect(user).toBeTruthy()
            expect(user.email).toEqual(email)
            expect(user.password).not.toEqual(password)
            done()
          }).catch(err => done(err))
        }
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

// GET /users
describe('GET /users', () => {
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

// GET /users/:id
describe('GET /users/:id', () => {
  it('should get the specified user', (done) => {
    const { _id, email, password } = users[0]

    request(app)
      .get(`/users/${ _id }`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toEqual(_id.toString())
        expect(res.body.email).toEqual(email)
        expect(res.body.password).not.toEqual(password)
      })
      .end(done)
  })

  it('should return 404 if user not found', (done) => {
    const { _id } = users[2]

    request(app)
      .get(`/users/${ _id }`)
      .expect(404)
      .end(done)
  })
})

// DELETE /users/:id
describe('DELETE /users/:id', () => {
  
  it('should delete the specified user', (done) => {
    const { _id } = users[0]
    request(app)
      .delete(`/users/${ _id }`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toEqual(_id.toString())
      })
      .end((err) => {
        if (err) {
          return done(err)
        } else {
          User.findById(_id).then((user) => {
            expect(user).toBeFalsy()
            done()
          }).catch(err => done(err))
        }
      })
  })

  it('should return 404 if the specified user is not found', (done) => {
    const { _id } = users[2]
    request(app)
      .delete(`/users/${ _id }`)
      .expect(404)
      .end(done)
  })
})

// PATCH /users
describe('PATCH /users/:id', () => {
  it('should update the specified user', (done) => {
    const { _id } = users[0]
    const { email, password } = users[2]

    request(app)
      .patch(`/users/${ _id }`)
      .send({ email, password })
      .expect(201)
      .expect((res) => {
        expect(res.body._id).toEqual(_id.toString())
        expect(res.body.email).toEqual(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        } else {
          User.findById(_id).then((user) => {
            expect(user).toBeTruthy()
            expect(user._id).toEqual(_id)
            expect(user.email).toEqual(email)
            expect(user.password).not.toEqual(password)
            done()
          }).catch(err => done(err))
        }
      })
  })

  it('should NOT create a duplicate user', (done) => {
    const { _id } = users[0]
    const { email, password } = users[1]

    request(app)
      .patch(`/users/${ _id }`)
      .send({ email, password })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err)
        } else {
          User.findById(_id).then((user) => {
            expect(user._id).toEqual(_id)
            expect(user.email).not.toEqual(email)
            done()
          }).catch(err => done(err))
        }
      })
  })

  it('should NOT update a user with an invalid email', (done) => {
    const { _id } = users[0]
    const { email, password } = users[3]

    request(app)
      .patch(`/users/${ _id }`)
      .send({ email, password })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err)
        } else {
          User.findById(_id).then((user) => {
            expect(user._id).toEqual(_id)
            expect(user.email).not.toEqual(email)
            done()
          }).catch(err => done(err))
        }
      })
  })

  it('should NOT update a user with an invalid password', (done) => {
    const { _id } = users[0]
    const { email, password } = users[4]

    request(app)
      .patch(`/users/${ _id }`)
      .send({ email, password })
      .expect(400)
      .end(done)
  })
})
