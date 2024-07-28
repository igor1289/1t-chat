import { Op } from 'sequelize'
import Room from '../models/room.js'
import User from '../models/user.js'
import RoomMembers from '../models/room-members.js'
import messagingService from './messaging.js'

async function findByName(name) {
  return await Room.findOne({
    where: {
      name: name
    }
  })
}

async function findById(id) {
  return await Room.findByPk(id)
}

async function create(name) {
  const existingRoom = await findByName(name)
  if (!existingRoom) return await Room.create({ name: name, isPrivate: false })
}

async function list() {
  return await Room.findAll()
}

async function search(name) {
  return await Room.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`
      }
    }
  })
}

async function userRooms(userId) {
  const rooms = await RoomMembers.findAll({
    attributes: ['alias'],
    raw: true,
    nest: true,
    include: Room,
    where: {
      UserId: userId
    }
  })

  return rooms.map((room) => {
    room.Room.alias = room.alias
    return room.Room
  })
}

async function join(userId, roomId) {
  const user = await User.findByPk(userId)
  const room = await Room.findByPk(roomId)

  if (user && room) {
    return await room.addUsers(userId)
  }
}

async function joinPrivate(userId1, userId2) {
  const room = await Room.create({ name: '', isPrivate: true }, { raw: true })

  if (room) {
    const user1 = await User.findByPk(userId1)
    const user2 = await User.findByPk(userId2)

    if (user1 && user2) {
      await RoomMembers.create({ RoomId: room.id, UserId: user1.id, alias: user2.name })
      await RoomMembers.create({ RoomId: room.id, UserId: user2.id, alias: user1.name })

      await messagingService.sendToUser(userId2, 'private', room)

      return room
    }
  }
}

export default {
  findById,
  findByName,
  create,
  list,
  search,
  userRooms,
  join,
  joinPrivate
}
