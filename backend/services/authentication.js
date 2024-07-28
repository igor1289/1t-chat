import JWT from 'jsonwebtoken'

const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET

function authenticate(req) {
  return getRequestPayload(req) != undefined
}

function getPayload(token) {
  try {
    return JWT.verify(token, JWT_AUTH_SECRET)
  } catch (error) {
    console.log(error)
    return undefined
  }
}

function signUserAccessToken(user) {
  const payload = user.getPayload()

  try {
    return JWT.sign(payload, JWT_AUTH_SECRET)
  } catch (error) {
    throw error
  }
}

function getRequestAccessToken(req) {
  const bearerToken = req.headers.authorization

  if (bearerToken) return bearerToken.split(' ')[1]
}

function getRequestPayload(req) {
  const token = getRequestAccessToken(req)

  if (!token) return undefined

  return verifyToken(token)
}

function verifyToken(token) {
  try {
    return JWT.verify(token, JWT_AUTH_SECRET)
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export default {
  authenticate,
  signUserAccessToken,
  getRequestAccessToken,
  verifyToken,
  getPayload
}
