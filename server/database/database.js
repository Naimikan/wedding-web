const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const defaultConnectValues = {
  host: '127.0.0.1',
  port: 27017,
  database: 'wedding-web'
}

function connectWithMongo (mongoHost = defaultConnectValues.host, mongoPort = defaultConnectValues.port, database = defaultConnectValues.database) {
  const databaseUrl = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + database

  return mongoose.connect(databaseUrl, {
    autoReconnect: true
  })
}

let mongodbConnectedBefore = false

mongoose.connection.on('error', () => { console.log('Could not connect to MongoDB') })
mongoose.connection.on('connected', () => { console.log('Connection established to MongoDB') })

mongoose.connection.on('disconnected', () => {
  console.log('Lost MongoDB connection...')

  if (!mongodbConnectedBefore) setTimeout(() => connectWithMongo(), 3000)
})

mongoose.connection.on('reconnected', () => { console.log('Reconnected to MongoDB') })

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Force to close the MongoDB conection')
    process.exit(0)
  })
})

exports.connectWithMongo = connectWithMongo

exports.findAll = (model, filters = {}, select = null, limit = 10, sort = { _id: -1 }) => {
  return new Promise((resolve, reject) => {
    var query = model.find(filters).limit(limit).sort(sort)

    if (select) query.select(select)

    query.exec((error, results) => {
      if (error) reject(error)

      resolve(results)
    })
  })
}

exports.findById = (model, modelId, select = null) => {
  return new Promise((resolve, reject) => {
    var query = model.findOne({ _id: modelId })

    if (select) query.select(select)

    query.exec((error, results) => {
      if (error) reject(error)

      resolve(results)
    })
  })
}

exports.createDocument = (model, modelBody) => {
  return new Promise((resolve, reject) => {
    model.create(modelBody, (error, results) => {
      if (error) reject(error)

      resolve(results)
    })
  })
}

exports.updateById = (model, modelId, modelNewBody) => {
  return new Promise((resolve, reject) => {
    model.update({
      _id: modelId
    }, modelNewBody).exec((error, results) => {
      if (error) reject(error)

      resolve(results)
    })
  })
}

exports.destroyById = (model, modelId) => {
  return new Promise((resolve, reject) => {
    model.remove({
      _id: modelId
    }).exec((error, results) => {
      if (error) reject(error)

      resolve(results)
    })
  })
}
