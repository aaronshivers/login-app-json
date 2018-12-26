require('dotenv').config()

const express = require('express')
const mongoose = require('./db/mongoose')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT

const userRoutes = require('./routes/user-routes')

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.use(userRoutes)

app.use((req, res, next) => {
  res.status(404).send('Sorry, we cannot find that!')
})

app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

app.listen(port)

module.exports = app
