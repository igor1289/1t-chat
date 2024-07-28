import { Model, DataTypes } from 'sequelize'
import sequelize from '../common/sequelize.js'

class RoomMembers extends Model {}

RoomMembers.init(
  {
    alias: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize
  }
)

export default RoomMembers
