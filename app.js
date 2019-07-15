require('dotenv').config()

const express = require('express')
const mongoose = require('./db/mongoose')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT

const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.use(indexRoutes)
app.use(userRoutes)

app.use((req, res, next) => {
  res.status(404).send('Sorry, we cannot find that!')
})

app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

const server = app.listen(port, () => console.log(`Server running on port ${ port }.`))

module.exports = server
