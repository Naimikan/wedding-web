const express = require('express')

let apiRoutes = express.Router()

apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' })
})

module.exports = apiRoutes
