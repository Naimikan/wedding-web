const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const utils = require('./utils/utils.js')

const app = express()

app.set('jwt_secret', utils.secret)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('morgan')('combined'))
app.use(require('helmet')())
app.use(require('cors')())
app.use(require('cookie-parser')())

app.use(express.static(path.join(__dirname, '../client/')))

const apiRoutes = require('./api/api.js')
app.use('/api', apiRoutes)

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.all('*', (req, res) => {
  res.status(404).send(utils.badRequest(new Error('404 Not Found')))
})

const databaseManager = require('./database/database.js')
databaseManager.connectWithMongo().then(() => {
  const port = process.env.PORT || 8080
  app.listen(port, () => { console.log(`Listening in port ${port}`) })
})
