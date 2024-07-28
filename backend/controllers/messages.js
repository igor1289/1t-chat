import { Router } from 'express'
import { apiError } from '../common/apiError.js'
import messagingService from '../services/messaging.js'

async function history(req, res) {
  if (req.params.roomId) {
    const history = await messagingService.getRoomHistory(req.params.roomId)
    res.json(history)
  } else {
    res.status(400)
    res.json(new apiError('Ошибка в параметрах запроса'))
  }
}

//Роутер
const router = Router()

router.get('/history/:roomId', history)

export default router
