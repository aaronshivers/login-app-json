const expect = require('expect')
const request = require('supertest')

const server = require('./../app')
const User = require('../models/users')
const createAuthToken = require('../middleware/createAuthToken')

describe('/users', () => {

  // test users
  const users = [{
    email: 'user0@test.net',
    password: 'asdfASDF1234!@#$'
  }, {
    email: 'user1@test.net',
    password: 'asdfASDF1234!@#$',
    isAdmin: true
  }]

  // add test users to the database
  const populateUsers = async () => {

    // delete all users
    await User.deleteMany()

    // create and save users
    const user0 = await new User(users[0]).save()
    const user1 = await new User(users[1]).save()

    return Promise.all([user0, user1])
  }

  // create authentication tokens
  const createTokens = async ([user0, user1]) => {

    // clear tokens
    tokens = []

    // create tokens
    const token0 = await createAuthToken(user0)
    const token1 = await createAuthToken(user1)

    return Promise.all([token0, token1])
  }

  beforeEach(async () => {
    return tokens = await createTokens(await populateUsers())
  })

  // POST /users
  describe('POST /users', () => {

    describe('if no data is provided', () => {

      it('should respond 400', async () => {

        await request(server)
          .post('/users')
          .expect(400)
      })

      it('should not set a cookie', async () => {

        await request(server)
          .post('/users')
          .expect((res) => {
            expect(res.header['set-cookie']).toBeFalsy()
          })
      })
    })

    describe('if data is provided', () => {

      describe('and `email` is invalid', async () => {

        it('should respond 400', async () => {

          await request(server)
            .post('/users')
            .send(users[0])
            .expect(400)
        })

        it('should not set a cookie', async () => {

          await request(server)
            .post('/users')
            .send(users[0])
            .expect((res) => {
              expect(res.header['set-cookie']).toBeFalsy()
            })
        })
      })

      describe('and `password` is invalid', async () => {

        it('should respond 400', async () => {

          await request(server)
            .post('/users')
            .send(users[0])
            .expect(400)
        })

        it('should not set a cookie', async () => {

          await request(server)
            .post('/users')
            .send(users[0])
            .expect((res) => {
              expect(res.header['set-cookie']).toBeFalsy()
            })
        })
      })

      describe('and all data is valid', () => {

        describe('and the `email` is already in the database', () => {

          it('should respond 400', async () => {

            await request(server)
              .post('/users')
              .send(users[0])
              .expect(400)
          })

          it('should not set a cookie', async () => {

            await request(server)
              .post('/users')
              .send(users[0])
              .expect((res) => {
                expect(res.header['set-cookie']).toBeFalsy()
              })
          })
        })

        describe('and the `email` is not in the database', () => {

          beforeEach(async () => await User.deleteMany())

          it('should respond 201', async () => {

            await request(server)
              .post('/users')
              .send(users[0])
              .expect(201)
          })

          it('should set a cookie', async () => {

            await request(server)
              .post('/users')
              .send(users[0])
              .expect((res) => {
                expect(res.header['set-cookie']).toBeTruthy()
              })
          })

          it('should return the user id', async () => {

            await request(server)
              .post('/users')
              .send(users[0])
              .expect((res) => {
                expect(res.body._id).toBeTruthy()
              })
          })

          it('should save the user in the database', async () => {

            await request(server)
              .post('/users')
              .send(users[0])

            const foundUser = await User.findOne({ email: users[0].email })
            expect(foundUser).toBeTruthy()
            expect(foundUser.email).toEqual(users[0].email)
            expect(foundUser.password).not.toEqual(users[0].password)
          })
        })
      })
    })
  })

  // GET /users
  describe('GET /users', () => {

    describe('if no `token` is provided', () => {

      it('should respond 401', async () => {

        await request(server)
          .get('/users')
          .expect(401)
      })
    })

    describe('if a `token` is provided', () => {

      describe('and user is not an `admin`', async () => {

        it('should respond 401', async () => {

          await request(server)
            .get('/users')
            .set('Cookie', `token=${ tokens[0] }`)
            .expect(401)
        })
      })

      describe('and user is an `admin`', async () => {

        it('should respond 200', async () => {

          await request(server)
            .get('/users')
            .set('Cookie', `token=${ tokens[1] }`)
            .expect(200)
        })

        it('should return all users', async () => {

          await request(server)
            .get('/users')
            .set('Cookie', `token=${ tokens[1] }`)
            .expect(200)
            .expect(res => {
              expect(res.body.length).toBe(2)
            })
        })
      })
    })
  })
})


// // GET /users/:id
// describe('GET /users/:id', () => {

//   it('should get the specified user', (done) => {
//     const { _id, email, password } = users[0]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .get(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body._id).toEqual(_id.toString())
//         expect(res.body.email).toEqual(email)
//         expect(res.body.password).not.toEqual(password)
//       })
//       .end(done)
//   })

//   it('should return 404 if user not found', (done) => {
//     const { _id } = users[2]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .get(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .expect(404)
//       .end(done)
//   })
// })

// // DELETE /users/:id
// describe('DELETE /users/:id', () => {
  
//   it('should delete the specified user', (done) => {
//     const { _id } = users[0]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .delete(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body._id).toEqual(_id.toString())
//       })
//       .end((err) => {
//         if (err) {
//           return done(err)
//         } else {
//           User.findById(_id).then((user) => {
//             expect(user).toBeFalsy()
//             done()
//           }).catch(err => done(err))
//         }
//       })
//   })

//   it('should return 404 if the specified user is not found', (done) => {
//     const { _id } = users[2]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .delete(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .expect(404)
//       .end(done)
//   })
// })

// // PATCH /users
// describe('PATCH /users/:id', () => {
//   it('should update the specified user', (done) => {
//     const { _id } = users[0]
//     const { email, password } = users[2]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .patch(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .send({ email, password })
//       .expect(201)
//       .expect((res) => {
//         expect(res.body._id).toEqual(_id.toString())
//         expect(res.body.email).toEqual(email)
//       })
//       .end((err) => {
//         if (err) {
//           return done(err)
//         } else {
//           User.findById(_id).then((user) => {
//             expect(user).toBeTruthy()
//             expect(user._id).toEqual(_id)
//             expect(user.email).toEqual(email)
//             expect(user.password).not.toEqual(password)
//             done()
//           }).catch(err => done(err))
//         }
//       })
//   })

//   it('should NOT create a duplicate user', (done) => {
//     const { _id } = users[0]
//     const { email, password } = users[1]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .patch(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .send({ email, password })
//       .expect(400)
//       .end((err) => {
//         if (err) {
//           return done(err)
//         } else {
//           User.findById(_id).then((user) => {
//             expect(user._id).toEqual(_id)
//             expect(user.email).not.toEqual(email)
//             done()
//           }).catch(err => done(err))
//         }
//       })
//   })

//   it('should NOT update a user with an invalid email', (done) => {
//     const { _id } = users[0]
//     const { email, password } = users[3]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .patch(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .send({ email, password })
//       .expect(400)
//       .end((err) => {
//         if (err) {
//           return done(err)
//         } else {
//           User.findById(_id).then((user) => {
//             expect(user._id).toEqual(_id)
//             expect(user.email).not.toEqual(email)
//             done()
//           }).catch(err => done(err))
//         }
//       })
//   })

//   it('should NOT update a user with an invalid password', (done) => {
//     const { _id } = users[0]
//     const { email, password } = users[4]
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .patch(`/users/${ _id }`)
//       .set('Cookie', cookie)
//       .send({ email, password })
//       .expect(400)
//       .end(done)
//   })
// })

// // GET /profile
// describe('GET /profile', () => {
//   it('should respond with 200 if user is logged in', (done) => {
//     const cookie = `token=${tokens[0]}`
//     request(server)
//       .get('/profile')
//       .set('Cookie', cookie)
//       .expect(200)
//       .end(done)
//   })

//   it('should respond with 401 if user is NOT logged in', (done) => {
//     request(server)
//       .get('/profile')
//       .expect(401)
//       .end(done)
//   })

//   it('should respond with 401 if token is phony', (done) => {
//     const cookie = `token=${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}`
//     request(server)
//       .get('/profile')
//       .set('Cookie', cookie)
//       .expect(401)
//       .end(done)
//   })
// })

// describe('POST /login', () => {
//   it('should login user and create a token', (done) => {
//     const { email, password } = users[0]
//     request(server)
//       .post('/login')
//       .send({ email, password })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body._id).toBeTruthy()
//         expect(res.header['set-cookie']).toBeTruthy()
//       })
//       .end(done)
//   })

//   it('should NOT login user if email is not in the database', (done) => {
//     const { email, password } = users[2]
//     request(server)
//       .post('/login')
//       .send({ email, password })
//       .expect(404)
//       .expect((res) => {
//         expect(res.body._id).toBeFalsy()
//         expect(res.header['set-cookie']).toBeFalsy()
//       })
//       .end(done)
//   })

//   it('should NOT login user if password is incorrect', (done) => {
//     const { email } = users[0]
//     const { password } = users[2]
//     request(server)
//       .post('/login')
//       .send({ email, password })
//       .expect(401)
//       .expect((res) => {
//         expect(res.body._id).toBeFalsy()
//         expect(res.header['set-cookie']).toBeFalsy()
//       })
//       .end(done)
//   })
// })

// // GET /admin
// describe('GET /admin', () => {
//   it('should respond 200 if user is admin', (done) => {
//     const cookie = `token=${tokens[0]}`

//     request(server)
//       .get('/admin')
//       .set('Cookie', cookie)
//       .expect(200)
//       .end(done)
//   })

//   it('should respond 401 if user is NOT admin', (done) => {
//     const cookie = `token=${tokens[1]}`

//     request(server)
//       .get('/admin')
//       .set('Cookie', cookie)
//       .expect(401)
//       .end(done)
//   })

//   it('should respond 401 if user is NOT logged in', (done) => {
//     request(server)
//       .get('/admin')
//       .expect(401)
//       .end(done)
//   })
// })

// // DELETE /logout
// describe('DELETE /logout', () => {
//   it('should logout user and delete auth token', (done) => {
//     const cookie = `token=${tokens[0]}`
//     request(server)
//       .delete('/logout')
//       .set('Cookie', cookie)
//       .expect(200)
//       .expect((res) => {
//         expect(res.header['set-cookie']).toEqual(["token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"])
//       })
//       .end(done)
//   })
// })
