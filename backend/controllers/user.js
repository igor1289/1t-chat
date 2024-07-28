import { Router } from 'express'
import { validationResult } from 'express-validator'
import { apiError } from '../common/apiError.js'

//Сервисы
import userService from '../services/user.js'

//Middleware
import userMiddleware from '../middleware/user.js'
//import authenticationMiddleware from '../middleware/authentication.js'

async function register(req, res) {
  const validation = validationResult(req)

  if (validation.isEmpty()) {
    const userData = await userService.register(req.body)

    if (userData) {
      res.status(200)
      res.json({ id: userData.id })
    } else {
      res.status(409)
      res.json(new apiError('Пользователь уже существует'))
    }
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

async function login(req, res) {
  const validation = validationResult(req)

  if (validation.isEmpty()) {
    const userData = await userService.login(req.body.name, req.body.password)

    if (userData) {
      res.json(userData)
    } else {
      res.status(400)
      res.json(new apiError('Неверное имя пользователя или пароль'))
    }
    // const user = await userService.findByName(req.body.name)

    // if (user) {
    //   if (await user.verifyPassword(req.body.password)) {
    //     res.json({ access_token: authenticationService.signUserAccessToken(user) })
    //   } else {
    //     res.status(400)
    //     res.json(new apiError('Неверный пароль'))
    //   }
    // } else {
    //   res.status(404)
    //   res.json(new apiError('Пользователь не найден'))
    // }
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

//Роутер
const router = Router()

router.post('/register', ...userMiddleware.create, register)
router.post('/login', ...userMiddleware.login, login)

export default router
