import {} from 'dotenv/config'
import userRouter from './controllers/user.js'
import roomRouter from './controllers/room.js'
import messagesRouter from './controllers/messages.js'
import cors from 'cors'

const { PORT, HOST } = process.env

//Создание экземпляра express
import express, { json, static as staticMiddleware } from 'express'
import sequelize from './common/sequelize.js'
import { setupAssociations } from './common/sequelize-associations.js'
import messagingService from './services/messaging.js'

const app = express()

//Дополнительная настройка
app.use(json())
app.use(cors())

// app.use(staticMiddleware('./app/views'))
// app.use('/public', staticMiddleware('./public/'))
setupAssociations()
sequelize.sync({ alter: true })

//Контроллеры
//TODO: Добавить middleware аутентификации для действии контроллеров (там где необходимо)
app.use('/user', userRouter)
app.use('/room', roomRouter)
app.use('/messages', messagesRouter)

//Запуск
app.listen(PORT, HOST, () => {
  console.log('Приложение запущено')
})

messagingService.startServer(app)
