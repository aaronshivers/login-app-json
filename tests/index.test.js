const request = require('supertest')
const server = require('./../app')

// GET /
describe('GET /', () => {

  it('should respond with 200', async () => {
    await request(server)
      .get('/')
      .expect(200)
  })
})