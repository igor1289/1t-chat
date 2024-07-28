import { createServer } from 'http'
import { Server } from 'socket.io'
import authService from './authentication.js'
import Message from '../models/message.js'
import User from '../models/user.js'
import { log } from 'console'

const { SOCKET_PORT } = process.env

const instance = { started: false }

function startServer(app) {
  const httpServer = createServer(app)
  const server = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  setup(server)

  httpServer.listen(SOCKET_PORT)

  instance.started = true
  instance.app = app
  instance.server = server

  console.log('Сервис сообщений запущен')
}

function authentication(socket, next) {
  if (socket.handshake.auth.token) {
    const payload = authService.verifyToken(socket.handshake.auth.token)
    if (payload) {
      socket.data.id = payload.id
      socket.data.name = payload.name
      next()
    } else {
      next(new Error('Пользователь не аутентифицирован'))
    }
  }
}

function setup(io) {
  io.on('connection', (socket) => {
    socket.on('join', async (rooms) => {
      for (const roomId of rooms) {
        socket.join(roomId)

        io.in(roomId).emit('onlineStatusChanged', {
          roomId,
          count: await countRoomUsers(roomId),
          total: await countUsers()
        })
      }
    })

    socket.on('message', async (messageData) => {
      const message = await saveMessage(messageData)

      io.to(messageData.roomId).emit('message', {
        id: message.id,
        text: message.text,
        RoomId: message.RoomId,
        createdAt: message.createdAt,
        User: {
          id: messageData.userId,
          name: messageData.userName
        }
      })
    })

    socket.on('disconnecting', async (reason) => {
      for (const roomId of socket.rooms) {
        io.in(roomId).emit('onlineStatusChanged', {
          roomId,
          count: await countRoomUsers(roomId),
          total: await countUsers()
        })
      }
    })
  })

  io.use(authentication)
}

async function countRoomUsers(room) {
  const roomSockets = await instance.server.in(room).fetchSockets()

  const roomUsers = new Set()

  roomSockets.forEach((roomSocket) => {
    roomUsers.add(roomSocket.data.id)
  })

  return roomUsers.size
}

async function countUsers() {
  const sockets = await instance.server.fetchSockets()

  const users = new Set()

  sockets.forEach((socket) => {
    users.add(socket.data.id)
  })

  return users.size
}

async function getRoomHistory(roomId, limit) {
  const messages = await Message.findAll({
    attributes: ['id', 'text', 'RoomId', 'createdAt'],
    limit,
    where: {
      RoomId: roomId
    },
    include: {
      attributes: ['id', 'name'],
      model: User,
      as: 'User'
    },
    order: [['createdAt', 'ASC']]
  })

  return messages
}

async function saveMessage(messageData) {
  const message = Message.build({
    text: messageData.text,
    RoomId: messageData.roomId,
    UserId: messageData.userId
  })

  await message.save()

  return message
}

async function sendToUser(userId, event, messageData) {
  const sockets = await instance.server.fetchSockets()

  const userSockets = sockets.filter((userSocket) => userSocket.data.id == userId)

  userSockets.forEach((userSocket) => {
    userSocket.emit(event, messageData)
  })
}

export default {
  startServer,
  saveMessage,
  getRoomHistory,
  sendToUser
}
