import { body } from 'express-validator'

export default {
  create: [body(['name', 'password']).trim().isString().notEmpty()],
  login: [body(['name', 'password']).trim().isString().notEmpty()]
}
