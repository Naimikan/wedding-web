const jwt = require('jsonwebtoken')

const secret = 'my W3dD1ng w3B'
const saltWorkFactor = 10

const mongooseToObject = mongooseObject => {
  mongooseObject = mongooseObject.toObject()
  delete mongooseObject['__v']
  if (mongooseObject.password) delete mongooseObject.password

  return mongooseObject
}

const successRequest = response => {
  if (Array.isArray(response)) response = response.map(r => mongooseToObject(r))
  else response = mongooseToObject(response)

  return {
    response: response,
    success: true
  }
}

const badRequest = error => {
  return { response: error, success: false }
}

const verifyAccessToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, req.app.get('jwt_secret'), (error, decoded) => {
      if (error) {
        // ToDo: morgan logger
        console.log(error)

        return res.json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' })
  }
}

module.exports = {
  secret, saltWorkFactor, mongooseToObject, successRequest, badRequest, verifyAccessToken
}
