import { Router } from 'express'
import { validationResult } from 'express-validator'
import { apiError } from '../common/apiError.js'
import roomService from '../services/room.js'

async function create(req, res) {
  if (req.body.name) {
    const newRoom = await roomService.create(req.body.name)

    if (newRoom) {
      res.json(newRoom)
    } else {
      res.status(409)
      res.json(new apiError('Комната с таким именем уже существует'))
    }
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

async function list(req, res) {
  res.json(await roomService.list())
}

async function search(req, res) {
  if (req.body.name) {
    res.json(await roomService.search(req.body.name))
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

async function join(req, res) {
  if (req.body.userId && req.body.roomId) {
    res.json(await roomService.join(req.body.userId, req.body.roomId))
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

async function joinPrivate(req, res) {
  if (req.body.userId1 && req.body.userId2 && req.body.userId1 != req.body.userId2) {
    res.json(await roomService.joinPrivate(req.body.userId1, req.body.userId2))
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

async function userRooms(req, res) {
  if (req.body.userId) {
    res.json(await roomService.userRooms(req.body.userId))
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

//Роутер
const router = Router()

router.post('/create', create)
router.post('/search', search)
router.post('/user', userRooms)
router.post('/join', join)
router.post('/private', joinPrivate)
router.get('/list', list)

export default router
