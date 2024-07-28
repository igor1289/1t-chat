import Message from '../models/message.js'
import RoomMembers from '../models/room-members.js'
import Room from '../models/room.js'
import User from '../models/user.js'

export function setupAssociations() {
  Room.hasMany(Message)
  Message.belongsTo(Room)
  Message.belongsTo(User)

  User.belongsToMany(Room, { through: RoomMembers })
  Room.belongsToMany(User, { through: RoomMembers })
  RoomMembers.belongsTo(Room)
  RoomMembers.belongsTo(User)
}
