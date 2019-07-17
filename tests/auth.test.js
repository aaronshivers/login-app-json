const expect = require('expect')
const simple = require('simple-mock')
const { ObjectId } = require('mongodb')

const createAuthToken = require('../middleware/createAuthToken')

const user = {
  _id: new ObjectId(),
  isAdmin: false,
  isAwesome: true
}

describe('createAuthToken()', () => {

  describe('if `user` is not provided', () => {

    it('should not return an `authToken`', async () => {})
  })

  describe('if `user` is provided', () => {

    it('should return an `authToken`', async () => {

      const authToken = await createAuthToken(user)

      expect(authToken).toBeTruthy()
    })
  })
})




