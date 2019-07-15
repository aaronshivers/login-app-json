const express =  require('express')
const router = express.Router()

// GET /
router.get('/', (req, res) => {
  res.json({
    title: 'Login Application',
    routes: {
      users: {
        'post': '/users',
        'get': '/users',
        'get :id': '/users/:id',
        'patch :id': '/users/:id',
        'delete :id': '/users/:id'
      },
      admin: '/admin'
    }
  })
})

module.exports = router
