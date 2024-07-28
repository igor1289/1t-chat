import { Model, DataTypes } from 'sequelize'
import sequelize from '../common/sequelize.js'

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(4096),
      allowNull: false
    }
  },
  {
    sequelize
  }
)

export default Message
