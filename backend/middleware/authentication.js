import { authenticate } from '../services/authentication'

export default (req, res, next) => {
  if (authenticate(req)) {
    next()
  } else {
    res.status(401)
    res.end()
  }
}
